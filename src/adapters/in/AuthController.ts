import type { Request, Response } from "express";
import {
  AuthenticationError,
  ValidationError,
} from "../../core/domain/errors.js";
import { ServiceContainer } from "../../shared/ServiceContainer.js";
import { unpackRefreshToken } from "../../shared/utils.js";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username) throw new ValidationError(`Username is required`);

    if (!password) throw new ValidationError(`Password is required`);

    const remoteAddress = req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.get("User-Agent") || req.headers["user-agent"] || "";

    const { access_token, refresh_token } =
      await ServiceContainer.auth.login.execute(username, password, {
        ip_address: remoteAddress,
        user_agent: userAgent,
      });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ access_token });
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) throw new AuthenticationError(`Refresh token missing.`);
    const { id, secret } = unpackRefreshToken(refreshToken);
    const remoteAddress = req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.get("User-Agent") || req.headers["user-agent"] || "";

    const { access_token, refresh_token } =
      await ServiceContainer.auth.refresh.execute(id, secret, {
        ip_address: remoteAddress,
        user_agent: userAgent,
      });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ access_token });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) throw new AuthenticationError(`Refresh token missing.`);
    const { id, secret } = unpackRefreshToken(refreshToken);
    await ServiceContainer.auth.logout.execute(id, secret);
    return res.status(200).send();
  }
}
