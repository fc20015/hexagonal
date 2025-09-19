import type { Request, Response } from "express";
import { ValidationError } from "../../core/domain/errors.js";
import { ServiceContainer } from "../../shared/ServiceContainer.js";
import { parseLazyParam } from "../../shared/utils.js";

type ValidField = "id" | "username" | "email";

function isValidField(field: any): field is ValidField {
  return ["id", "username", "email"].includes(field);
}

export class UserController {
  static async create(req: Request, res: Response) {
    const {
      username,
      password,
      email,
      full_name,
      roles = [],
      permissions = [],
    } = req.body;

    const requiredFields: [string, any][] = [
      ["username", username],
      ["password", password],
      ["email", email],
      ["full_name", full_name],
    ];

    for (const [fieldName, value] of requiredFields) {
      if (!value) throw new ValidationError(`${fieldName} is required`);
    }

    const userId = await ServiceContainer.users.create.execute(
      username,
      password,
      email,
      full_name,
      roles,
      permissions
    );

    return res.status(200).json({ id_user: userId });
  }

  static async getAll(req: Request, res: Response) {
    const isLazy = parseLazyParam(req.query.lazy);
    const users = await ServiceContainer.users.getAll.execute(isLazy);
    return res.status(200).json(users);
  }

  static async getBy(req: Request, res: Response) {
    if (!req.params.field)
      throw new ValidationError(`The search field is required`);
    const validFields = ["id", "username", "email"];
    const field = req.params.field;
    const value = req.query.value;
    const isLazy = parseLazyParam(req.query.lazy);

    if (!isValidField(field))
      throw new ValidationError(
        `Invalid field ${field}. Must be one of ${validFields.join(",")}`
      );

    if (!value)
      throw new ValidationError(`'value' query parameter is required.`);

    const user = await ServiceContainer.users.getBy.execute(
      field,
      String(value),
      isLazy
    );

    return res.status(200).json(user);
  }

  static async getProfile(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required.`);

    const profile = await ServiceContainer.users.getProfile.execute(
      req.params.id
    );

    return res.status(200).json(profile);
  }

  static async getPermissions(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required.`);

    const permissions = await ServiceContainer.users.getPermissions.execute(
      req.params.id
    );

    return res.status(200).json(permissions);
  }

  static async getRoles(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required.`);

    const roles = await ServiceContainer.users.getRoles.execute(req.params.id);

    return res.status(200).json(roles);
  }

  static async update(req: Request, res: Response) {
    const {
      id,
      username,
      password_hash,
      email,
      full_name,
      is_active,
      created_at,
      updated_at,
      roles = [],
      permissions = [],
    } = req.body;

    const requiredFields: [string, any][] = [
      ["User ID", id],
      ["Username", username],
      ["Email", email],
      ["Full name", full_name],
      ["User active flag", is_active],
    ];

    for (const [fieldName, value] of requiredFields) {
      if (!value) throw new ValidationError(`${fieldName} is required.`);
    }

    await ServiceContainer.users.update.execute({
      id,
      username,
      password_hash,
      email,
      full_name,
      is_active,
      created_at,
      updated_at,
      roles,
      permissions,
    });

    return res.status(204).send();
  }

  static async delete(req: Request, res: Response) {
    if (!req.params.id) throw new ValidationError(`User ID is required.`);

    await ServiceContainer.users.delete.execute(req.params.id);

    return res.status(204).send();
  }
}
