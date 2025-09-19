import { DatabaseError } from "../../../core/domain/errors.js";
import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { User } from "../../../core/domain/User.js";
import { type UserRepository } from "../../../core/ports/out/UserRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";
import {
  mapToPermissionDomain,
  mapToRoleDomain,
  mapToUserDomain,
} from "../../../shared/utils.js";

const LAZY_BASE_QUERY = `
  SELECT 
    u.id_user AS id,
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
    u.id_user AS id,
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
    field: "id" | "username" | "email",
    value: string,
    lazy: boolean = true
  ): Promise<User | null> {
    const client = await getClient();

    try {
      const getUserByQuery = `
        ${lazy ? LAZY_BASE_QUERY : EAGGER_BASE_QUERY}
        WHERE ${field === "id" ? "id_user" : field} = $1
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

  async getUserProfile(id_user: string): Promise<User> {
    const client = await getClient();

    try {
      const getUserProfileQuery = `
        ${EAGGER_BASE_QUERY}
        WHERE u.id_user = $1
        ${GROUP_BY}
      `;

      console.log(id_user);
      const resProfile = await client.query(getUserProfileQuery, [id_user]);

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

  async updateUser(currentUser: User, updatedUser: User): Promise<void> {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      const updateUserPropertiesQuery = `
        UPDATE users SET
          username = $1,
          email = $2,
          full_name = $3,
          is_active = $4,
          updated_at = NOW()
        WHERE id_user = $5
      `;

      await client.query(updateUserPropertiesQuery, [
        updatedUser.username,
        updatedUser.email,
        updatedUser.full_name,
        updatedUser.is_active,
        updatedUser.id_user,
      ]);

      const currentRolesId = new Set(currentUser.roles.map((r) => r.id));
      const updatedRolesId = new Set(updatedUser.roles.map((r) => r.id));

      // roles to add and remove
      const rolesToAdd = [...updatedRolesId].filter(
        (id) => !currentRolesId.has(id)
      );

      if (rolesToAdd.length > 0) {
        for (const id of rolesToAdd) {
          await client.query(
            `
            INSERT INTO users_roles(id_user, id_role)
            VALUES ($1, $2)
          `,
            [updatedUser.id_user, id]
          );
        }
      }

      const rolesToRemove = [...currentRolesId].filter(
        (id) => !updatedRolesId.has(id)
      );

      if (rolesToRemove.length > 0) {
        for (const id of rolesToRemove) {
          await client.query(
            `
            DELETE FROM users_roles
            WHERE id_user = $1 AND id_role = $2
          `,
            [updatedUser.id_user, id]
          );
        }
      }

      const currentPermissionsId = new Set(
        currentUser.permissions.map((p) => p.id)
      );
      const updatedPermissionsId = new Set(
        updatedUser.permissions.map((p) => p.id)
      );

      //permissions to add and remove
      const permissionsToAdd = [...updatedPermissionsId].filter(
        (id) => !currentPermissionsId.has(id)
      );

      if (permissionsToAdd.length > 0) {
        for (const id of permissionsToAdd) {
          await client.query(
            `
            INSERT INTO users_permissions(id_user, id_permission)
            VALUES ($1, $2)
          `,
            [updatedUser.id_user, id]
          );
        }
      }

      const permissionsToRemove = [...currentPermissionsId].filter(
        (id) => !updatedPermissionsId.has(id)
      );

      if (permissionsToRemove.length > 0) {
        for (const id of permissionsToRemove) {
          await client.query(
            `
              DELETE FROM users_permissions
              WHERE id_user = $1 AND id_permission = $2
            `,
            [updatedUser.id_user, id]
          );
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query(`ROLLBACK`);
      throw new DatabaseError(`Error updating user: ${err}`);
    } finally {
      client.release();
    }
  }

  async deleteUser(id_user: string): Promise<void> {
    const client = await getClient();

    try {
      const deleteUserQuery = `
        DELETE FROM users 
        WHERE id_user = $1
      `;

      await client.query(deleteUserQuery, [id_user]);

      return;
    } catch (err) {
      throw new DatabaseError(`Error deleting user: ${err}`);
    } finally {
      client.release();
    }
  }
}
