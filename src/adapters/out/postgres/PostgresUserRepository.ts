import { DatabaseError } from "../../../core/domain/errors.js";
import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { User } from "../../../core/domain/User.js";
import { UserEmail } from "../../../core/domain/UserEmail.js";
import { type UserRepository } from "../../../core/ports/out/UserRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";
import {
  mapToPermissionDomain,
  mapToRoleDomain,
  mapToUserDomain,
} from "../../../shared/utils.js";

const LAZY_BASE_QUERY = `
  SELECT 
    u.id_user,
    u.username,
    u.password_hash,
    u.email,
    u.full_name,
    u.is_active,
    u.created_at,
    u.updated_at
  FROM users u
`;

const EAGGER_BASE_QUERY = `
  SELECT
    u.id_user,
    u.username,
    u.password_hash,
    u.email,
    u.full_name,
    u.is_active,
    u.created_at,
    u.updated_at,
    (
      SELECT json_agg(json_build_object(
        'id', r.id_role,
        'name', r.name,
        'permissions', 
          (
            SELECT json_agg(json_build_object(
              'id', p.id_permission,
              'name', p.name,
              'description', p.description
            ))
            FROM roles_permissions rp
            JOIN permissions p ON p.id_permission = rp.id_permission
            WHERE rp.id_role = r.id_role
          )
      )) 
      FROM users_roles ur
      LEFT JOIN roles r ON ur.id_role = r.id_role
      WHERE ur.id_user = u.id_user
    ) AS roles,
    (
      SELECT json_agg(json_build_object(
        'id', p.id_permission,
        'name', p.name,
        'description', p.description
      ))
      FROM users_permissions up
      LEFT JOIN permissions p ON up.id_permission = p.id_permission
      WHERE up.id_user = u.id_user
    ) AS permissions
  FROM users u
`;

const GROUP_BY = `
  GROUP BY
    u.id_user,
    u.username,
    u.password_hash,
    u.email,
    u.full_name,
    u.is_active,
    u.created_at,
    u.updated_at;
`;

export class PostgresUserRepository implements UserRepository {
  async createUser(user: User): Promise<string> {
    const client = await getClient();

    try {
      const createUserQuery = `
        INSERT INTO
          users(
            id_user,
            username,
            password_hash,
            email,
            full_name
          )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_user
      `;

      const resUser = await client.query(createUserQuery, [
        user.id_user,
        user.username,
        user.password_hash,
        user.email,
        user.full_name,
      ]);

      return resUser.rows[0].id_user;
    } catch (err) {
      throw new DatabaseError(`Error creating user: ${err}`);
    } finally {
      client.release();
    }
  }

  async getAllUsers(lazy: boolean = true): Promise<User[]> {
    const client = await getClient();

    try {
      const getAllUsersQuery = `
        ${lazy ? LAZY_BASE_QUERY : EAGGER_BASE_QUERY}
        ${!lazy ? GROUP_BY : ""}
      `;

      const resUsers = await client.query(getAllUsersQuery);

      if (resUsers.rowCount === 0) return [];

      return resUsers.rows.map((row) => mapToUserDomain(row));
    } catch (err) {
      throw new DatabaseError(`Error getting all users: ${err}`);
    } finally {
      client.release();
    }
  }

  async getUserBy(
    field: "id_user" | "username" | "email",
    value: string,
    lazy: boolean = true
  ): Promise<User | null> {
    const client = await getClient();

    try {
      const getUserByQuery = `
        ${lazy ? LAZY_BASE_QUERY : EAGGER_BASE_QUERY}
        WHERE ${field} = $1
        ${!lazy ? GROUP_BY : ""}
      `;

      const resUser = await client.query(getUserByQuery, [value]);

      if (resUser.rowCount === 0) return null;

      return mapToUserDomain(resUser.rows[0]);
    } catch (err) {
      throw new DatabaseError(`Error getting user by ${field}: ${err}`);
    } finally {
      client.release();
    }
  }

  async getUserProfile(id_user: string): Promise<User | null> {
    const client = await getClient();

    try {
      const getUserProfileQuery = `
        ${EAGGER_BASE_QUERY}
        WHERE u.id_user = $1
        ${GROUP_BY}
      `;

      const resProfile = await client.query(getUserProfileQuery, [id_user]);

      if (resProfile.rowCount === 0) return null;

      return mapToUserDomain(resProfile.rows[0]);
    } catch (err) {
      throw new DatabaseError(`Error fetch user profile: ${err}`);
    } finally {
      client.release();
    }
  }

  async getUserRoles(id_user: string): Promise<Role[]> {
    const client = await getClient();

    try {
      const getUserRolesQuery = `
        SELECT 
          r.id_role AS id,
          r.name
        FROM users_roles ur
        LEFT JOIN roles r ON r.id_role = ur.id_role
        WHERE ur.id_user = $1
        GROUP BY r.id_role, r.name
      `;

      const resRoles = await client.query(getUserRolesQuery, [id_user]);

      if (!resRoles.rows[0].id) return [];

      return resRoles.rows.map((row) => mapToRoleDomain(row));
    } catch (err) {
      throw new DatabaseError(`Error getting user roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async getUserPermissions(id_user: string): Promise<Permission[]> {
    const client = await getClient();

    try {
      const getUserPermissionsQuery = `
        SELECT
          p.id_permission AS id,
          p.name,
          p.description
        FROM users u
        LEFT JOIN users_permissions up ON up.id_user = u.id_user
        LEFT JOIN permissions p ON p.id_permission = up.id_permission
        WHERE u.id_user = $1
        GROUP BY 
          p.id_permission,
          p.name,
          p.description;
      `;

      const resPermissions = await client.query(getUserPermissionsQuery, [
        id_user,
      ]);

      if (!resPermissions.rows[0].id) return [];

      return resPermissions.rows.map((row) => mapToPermissionDomain(row));
    } catch (err) {
      throw new DatabaseError(`Error getting user permissions: ${err}`);
    } finally {
      client.release();
    }
  }

  async updateUser(user: User): Promise<void> {
    return;
  }

  async deleteUser(id_user: string): Promise<void> {
    return;
  }
}
