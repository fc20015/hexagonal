import type { Request, Response } from "express";
import { ServiceContainer } from "../../shared/ServiceContainer.js";

export class RoleController {
  static async findAll(req: Request, res: Response) {
    const roles = await ServiceContainer.roles.findAll.execute();
    res.json(roles).status(200);
  }

  static async findById(req: Request, res: Response) {
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
    res.json(role).status(200);
  }

  static async save(req: Request, res: Response) {
    const { id, name, permissions } = req.body;
    if (!name) {
      res.status(400).json({ error: "Role name is required" });
      return;
    }
    const role = await ServiceContainer.roles.save.execute({
      id,
      name,
      permissions,
    });
    res.json(role).status(201);
  }
}
