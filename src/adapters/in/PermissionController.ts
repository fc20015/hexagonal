import type { Request, Response } from "express";
import { ServiceContainer } from "../../shared/ServiceContainer.js";
import { ValidationError } from "../../core/domain/errors.js";

export class PermissionController {
  static async findAll(req: Request, res: Response) {
    const permissions = await ServiceContainer.permissions.findAll.execute();
    return res.status(200).json(permissions);
  }

  static async findById(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`Permission ID is required`);

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new ValidationError(`Permission ID must be a number`);

    const permission = await ServiceContainer.permissions.findById.execute(id);
    return res.status(200).json(permission);
  }
}
