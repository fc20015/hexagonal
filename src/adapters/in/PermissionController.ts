import type { Request, Response } from "express";
import { ServiceContainer } from "../../shared/ServiceContainer.js";
import {
  PermissionNotFoundError,
  ValidationError,
} from "../../core/domain/errors.js";

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

  static async create(req: Request, res: Response) {
    const { name, description } = req.body;
    if (!name) throw new ValidationError(`Permission name is required`);
    const newId = await ServiceContainer.permissions.create.execute(
      name,
      description
    );
    res.status(201).json({ permission_id: newId });
  }

  static async update(req: Request, res: Response) {
    const { id, name, description } = req.body;
    if (!id) throw new ValidationError(`Permission ID is required`);
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
      throw new ValidationError(`Permission ID must be a number`);
    if (!name) throw new ValidationError(`Permission name is required`);

    const currentPermission =
      await ServiceContainer.permissions.findById.execute(numericId);
    if (!currentPermission)
      throw new PermissionNotFoundError(
        `Permission with ID ${numericId} not found`
      );

    await ServiceContainer.permissions.update.execute(
      numericId,
      name,
      description
    );
    res.status(204).send();
  }

  static async delete(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`Permission ID is required`);
    const numericId = parseInt(req.params.id, 10);
    if (isNaN(numericId))
      throw new ValidationError(`Permission ID must be a number`);

    const currentPermission =
      await ServiceContainer.permissions.findById.execute(numericId);
    if (!currentPermission)
      throw new PermissionNotFoundError(
        `Permission with ${numericId} not found`
      );
    await ServiceContainer.permissions.delete.execute(numericId);
    res.status(204).send();
  }
}
