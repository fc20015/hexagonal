import type { Request, Response } from "express";
import { ValidationError } from "../../core/domain/errors.js";
import { ServiceContainer } from "../../shared/ServiceContainer.js";

export class UserController {
  static async create(req: Request, res: Response) {
    const { username, password, email, full_name } = req.body;

    if (!username) throw new ValidationError(`Username is required`);
    if (!password) throw new ValidationError(`Password is required`);
    if (!email) throw new ValidationError(`Email is required`);
    if (!full_name) throw new ValidationError(`Full name is required`);

    const assignedID = await ServiceContainer.users.create.execute(
      username,
      password,
      email,
      full_name
    );

    return res.status(201).json({ id_user: assignedID });
  }

  static async findById(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required`);

    const user = await ServiceContainer.users.findById.execute(req.params.id);

    return res.status(200).json(user);
  }

  static async addRoles(req: Request, res: Response) {
    const { roles = [] } = req.body;
    if (!req.params.id) throw new ValidationError(`User ID is required`);
    await ServiceContainer.users.addRoles.execute(req.params.id, roles);
    res.status(202).send();
  }

  static async getRoles(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required`);
    const roles = await ServiceContainer.users.getRoles.execute(req.params.id);
    res.status(200).json(roles);
  }
}
