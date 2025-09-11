import { DatabaseError } from "../../../core/domain/errors.js";
import { Permission } from "../../../core/domain/Permission.js";
import type { PermissionRepository } from "../../../core/ports/out/PermissionRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";

const BASE_PERMIMSSION_QUERY = `
  SELECT
    id_permission,
    name,
    description
  FROM permissions
`;

interface PermissionRow {
  id_permission: number;
  name: string;
  description: string;
}

function mapRowToPermission(row: PermissionRow): Permission {
  return new Permission(row.id_permission, row.name, row.description);
}

export class PostgresPermissionRepository implements PermissionRepository {
  async create(permission: Permission): Promise<number> {
    const client = await getClient();

    try {
      const createQuery = `
        INSERT INTO permissions(id_permission, name, description)
        VALUES (nextval('seq_permissions'), $1, $2)
        RETURNING id_permission
      `;

      const resPermission = await client.query(createQuery, [
        permission.name,
        permission.description,
      ]);

      return resPermission.rows[0].id_permission;
    } catch (err) {
      throw new DatabaseError(`Error creating the permission ${err}`);
    } finally {
      client.release();
    }
  }

  async findById(permissionId: number): Promise<Permission | null> {
    const client = await getClient();
    try {
      const findQuery = `
        ${BASE_PERMIMSSION_QUERY}
        WHERE id_permission = $1
      `;
      const resPermission = await client.query(findQuery, [permissionId]);

      if (resPermission.rowCount === 0) return null;

      return mapRowToPermission(resPermission.rows[0]);
    } catch (err) {
      throw new DatabaseError(
        `Error finding permission by id ${permissionId}: ${err}`
      );
    } finally {
      client.release();
    }
  }

  async findByName(permissionName: string): Promise<Permission | null> {
    const client = await getClient();
    try {
      const findQuery = `
        ${BASE_PERMIMSSION_QUERY}
        WHERE name = $1
      `;
      const resPermission = await client.query(findQuery, [permissionName]);

      if (resPermission.rowCount === 0) return null;

      return mapRowToPermission(resPermission.rows[0]);
    } catch (err) {
      throw new DatabaseError(
        `Error finding permission by name ${permissionName}: ${err}`
      );
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Permission[]> {
    const client = await getClient();

    try {
      const resPermission = await client.query(BASE_PERMIMSSION_QUERY);

      if (resPermission.rowCount === 0) return [];

      const permissions: Permission[] = resPermission.rows.map(
        (p: PermissionRow) => {
          return mapRowToPermission(p);
        }
      );

      return permissions;
    } catch (err) {
      throw new DatabaseError(`Error finding all permissions ${err}`);
    } finally {
      client.release();
    }
  }

  async update(updatedPermission: Permission): Promise<void> {
    const client = await getClient();

    try {
      const updateQuery = `
        UPDATE permissions 
        SET name = $1
        SET description = $2
        WHERE id_permission = $3
      `;

      await client.query(updateQuery, [
        updatedPermission.name,
        updatedPermission.description,
        updatedPermission.id,
      ]);
    } catch (err) {
      throw new DatabaseError(`Error updating the permission ${err}`);
    } finally {
      client.release();
    }
  }

  async delete(permissionId: number): Promise<void> {
    const client = await getClient();

    try {
      const removeQuery = `
        DELETE FROM permissions
        WHERE id_permission = $1
      `;

      await client.query(removeQuery, [permissionId]);
    } catch (err) {
      throw new DatabaseError(`Error removing the permission: ${err}`);
    } finally {
      client.release();
    }
  }
}
