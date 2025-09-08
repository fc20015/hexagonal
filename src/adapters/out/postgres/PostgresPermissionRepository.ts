import { Permission } from "../../../core/domain/Permission.js";
import type { PermissionRepository } from "../../../core/ports/out/PermissionRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";

export class PostgresPermissionRepository implements PermissionRepository {
  async findByName(permissionName: string): Promise<Permission | null> {
    const findQuery = {
      text: `SELECT * FROM permissions WHERE name = $1`,
      values: [permissionName],
    };

    const client = await getClient();
    try {
      const result = await client.query(findQuery);
      if (result.rowCount === 0) return null;
      return new Permission(
        result.rows[0].id_permission,
        result.rows[0].name,
        result.rows[0].description
      );
    } catch (err) {
      throw new Error(
        `Error finding permission by name ${permissionName}: ${err}`
      );
    } finally {
      client.release();
    }
  }
  async findById(permissionId: number): Promise<Permission | null> {
    const findQuery = {
      text: `SELECT * FROM permissions WHERE id_permission = $1`,
      values: [permissionId],
    };

    const client = await getClient();
    try {
      const result = await client.query(findQuery);
      if (result.rowCount === 0) return null;
      return new Permission(
        result.rows[0].id_permission,
        result.rows[0].name,
        result.rows[0].description
      );
    } catch (err) {
      throw new Error(`Error finding permission by id ${permissionId}: ${err}`);
    } finally {
      client.release();
    }
  }
}
