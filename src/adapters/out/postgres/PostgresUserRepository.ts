import { DatabaseError } from "../../../core/domain/errors.js";
import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { User } from "../../../core/domain/User.js";
import { UserEmail } from "../../../core/domain/UserEmail.js";
import { type UserRepository } from "../../../core/ports/out/UserRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";
import { mapToUserDomain } from "../../../shared/utils.js";

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
    return [];
  }

  async getUserBy(
    field: "id" | "username" | "email",
    value: string,
    lazy: boolean = true
  ): Promise<User | null> {
    return null;
  }

  async getUserProfile(id_user: string): Promise<User | null> {
    return null;
  }

  async getUserRoles(id_user: string): Promise<Role[]> {
    return [];
  }

  async getUserPermissions(id_user: string): Promise<Permission[]> {
    return [];
  }

  async updateUserRoles(id_user: string, roles: Role[]): Promise<void> {
    return;
  }

  async updateUserPermissions(
    id_user: string,
    permissions: Permission[]
  ): Promise<void> {
    return;
  }

  async updateUser(user: User): Promise<void> {
    return;
  }

  async deleteUser(id_user: string): Promise<void> {
    return;
  }
}
