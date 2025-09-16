import type { Request, Response } from "express";
import { ValidationError } from "../../core/domain/errors.js";
import { ServiceContainer } from "../../shared/ServiceContainer.js";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username) throw new ValidationError(`Username is required`);

    if (!password) throw new ValidationError(`Password is required`);

    const token = await ServiceContainer.auth.login.execute(username, password);

    return res.status(200).json({ token: token });
  }
}
