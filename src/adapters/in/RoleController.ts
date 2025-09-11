import type { Request, Response } from "express";
import { ServiceContainer } from "../../shared/ServiceContainer.js";
import {
  DomainError,
  RoleAlreadyExistsError,
  ValidationError,
} from "../../core/domain/errors.js";

export class RoleController {
  static async create(req: Request, res: Response) {
    const { name, permissions = [] } = req.body;

    const roleId = await ServiceContainer.roles.create.execute(
      name,
      permissions
    );

    return res.status(201).json({ id: roleId });
  }

  static async findById(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError("Role ID is required");

    const roleId = parseInt(req.params.id, 10);

    if (isNaN(roleId)) throw new ValidationError(`Role ID must be a number`);

    const role = await ServiceContainer.roles.findById.execute(roleId);

    res.json(role).status(200);
  }

  static async findAll(req: Request, res: Response) {
    const roles = await ServiceContainer.roles.findAll.execute();
    res.json(roles).status(200);
  }

  static async update(req: Request, res: Response) {
    const { id = null, name = null, permissions = [] } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    await ServiceContainer.roles.update.execute(id, name, permissions);
    return res.status(204).send();
  }

  static async delete(req: Request, res: Response) {
    if (!req.params.id) {
      res.status(400).json({ error: "Role ID is required" });
      return;
    }
    const roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
      res.status(400).json({ error: "Role ID must be a number" });
      return;
    }
    const role = await ServiceContainer.roles.findById.execute(roleId);
    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }
    await ServiceContainer.roles.delete.execute(roleId);
    return res.status(204).send();
  }
}
