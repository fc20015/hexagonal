import { DatabaseError } from "../../../core/domain/errors.js";
import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { User } from "../../../core/domain/User.js";
import { UserEmail } from "../../../core/domain/UserEmail.js";
import { type UserRepository } from "../../../core/ports/out/UserRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";
import { mapToUserDomain } from "../../../shared/utils.js";

const USER_BASE_QUERY = `
  SELECT 
    id_user,
    username,
    password_hash,
    email,
    full_name,
    is_active,
    created_at,
    updated_at
  FROM users
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
  async getUserById(id_user: string): Promise<User | null> {
    const client = await getClient();

    try {
      const findByIdQuery = `
        ${USER_BASE_QUERY}
        WHERE id_user = $1
      `;

      const resUser = await client.query(findByIdQuery, [id_user]);

      if (resUser.rowCount === 0) return null;

      return mapToUserDomain(resUser.rows[0]);
    } catch (err) {
      throw new DatabaseError(`Error finding user by id: ${err}`);
    } finally {
      client.release();
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const client = await getClient();

    try {
      const findByUsernameQuery = `
        ${USER_BASE_QUERY}
        WHERE username = $1
      `;

      const resUser = await client.query(findByUsernameQuery, [username]);

      if (resUser.rowCount === 0) return null;

      return mapToUserDomain(resUser.rows[0]);
    } catch (err) {
      throw new DatabaseError(`Error finding user by username: ${err}`);
    } finally {
      client.release();
    }
  }
  async getUserByEmail(email: UserEmail): Promise<User | null> {
    const client = await getClient();

    try {
      const findByEmailQuery = `
        ${USER_BASE_QUERY}
        WHERE email = $1
      `;

      const resUser = await client.query(findByEmailQuery, [email.email]);

      if (resUser.rowCount === 0) return null;

      return mapToUserDomain(resUser.rows[0]);
    } catch (err) {
      throw new DatabaseError(`Error finding user by email: ${err}`);
    } finally {
      client.release();
    }
  }
  async getPermissionsByUserId(id_user: string): Promise<Permission[]> {
    const client = await getClient();

    try {
      const fetchPermissionsQuery = `
        SELECT
          p.id_permission,
          p.name,
          p.description
        FROM users_permissions up
        LEFT JOIN permissions p ON p.id_permission = up.id_permission
        WHERE up.id_user = $1
        GROUP BY p.id_permission, p.name, p.description
      `;

      const resPermissions = await client.query(fetchPermissionsQuery, [
        id_user,
      ]);

      if (resPermissions.rowCount === 0) return [];

      return resPermissions.rows.map(
        (row) => new Permission(row.id_permission, row.name, row.description)
      );
    } catch (err) {
      throw new DatabaseError(`Error fetch user permissions: ${err}`);
    } finally {
      client.release();
    }
  }
  async getRolesByUserId(id_user: string): Promise<Role[]> {
    const client = await getClient();

    try {
      const fetchRolesQuery = `
        SELECT
          r.id_role,
          r.name
        FROM users_roles ur
        LEFT JOIN roles r ON r.id_role = ur.id_role
        WHERE ur.id_user = $1
        GROUP BY r.id_role, r.name
      `;

      const resRoles = await client.query(fetchRolesQuery, [id_user]);

      if (resRoles.rowCount === 0) return [];

      return resRoles.rows.map((row) => {
        return new Role(row.id_role, row.name);
      });
    } catch (err) {
      throw new DatabaseError(`Error fetch user roles: ${err} `);
    } finally {
      client.release();
    }
  }
  async addRolesToUser(id_user: string, roles: Role[]): Promise<void> {
    const client = await getClient();

    try {
      await client.query("BEGIN");
      for (const role of roles) {
        await client.query(
          `
          INSERT INTO 
            users_roles(id_user, id_role)
          VALUES ($1, $2)
        `,
          [id_user, role.id]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw new DatabaseError(`Error adding user roles: ${err}`);
    } finally {
      client.release();
    }
  }
  async removeRolesFromUser(id_user: string, role: Role[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addPermissionsToUser(
    id_user: string,
    permissions: Permission[]
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async removePermissionsFromUser(
    id_user: string,
    permissions: Permission[]
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async updateUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async deleteUser(id_user: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
