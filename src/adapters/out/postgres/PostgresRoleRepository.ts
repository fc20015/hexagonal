import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { type RoleRepository } from "../../../core/ports/out/RoleRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";

type PermissionRow = {
  id_permission: number;
  name: string;
  description: string;
};

type RoleRow = {
  id_role: number;
  name: string;
  permissions: PermissionRow[];
};

const BASE_ROLE_QUERY = `
  SELECT
    r.id_role,
    r.name,
    json_agg(
      json_build_object(
        'id_permission', p.id_permission,
        'name', p.name,
        'description', p.description
      )
    ) AS permissions
  FROM roles r
  LEFT JOIN roles_permissions rp ON rp.id_role = r.id_role
  LEFT JOIN permissions p ON p.id_permission = rp.id_permission
`;

function mapRowToRole(row: RoleRow): Role {
  const permissions = (row.permissions || []).map((p) => {
    return new Permission(p.id_permission, p.name, p.description);
  });
  return new Role(row.id_role, row.name, permissions);
}

export class PostgresRoleRepository implements RoleRepository {
  async create(role: Role): Promise<number> {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      //1. Insert new role
      const insertQuery = `
        INSERT INTO roles(id_role, name)
        VALUES (nextval('seq_roles'), $1)
        RETURNING id_role
      `;
      const resRole = await client.query(insertQuery, [role.name]);

      if (resRole.rowCount === 0) throw new Error(`Cannot create role`);

      const newRoleId: number = resRole.rows[0].id_role;

      console.log(newRoleId);

      //2. Insert permissions (if exists)
      if (role.permissions.length > 0) {
        const insertPermissionQuery = `
          INSERT INTO roles_permissions(id_role, id_permission)
          VALUES ($1, $2)
        `;

        await Promise.all(
          role.permissions.map((p) =>
            client.query(insertPermissionQuery, [newRoleId, p.id])
          )
        );
      }
      await client.query("COMMIT");
      return newRoleId;
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(`Error creating new role: ${err}`);
    } finally {
      client.release();
    }
  }

  async findById(roleId: number): Promise<Role | null> {
    const findQuery = {
      text: ` 
        ${BASE_ROLE_QUERY}
        WHERE r.id_role = $1
        GROUP BY r.id_role, r.name
    `,
      values: [roleId],
    };

    const client = await getClient();

    try {
      const res = await client.query(findQuery);

      if (res.rowCount === 0) return null;

      return res.rows[0].permissions[0].id_permission
        ? mapRowToRole(res.rows[0])
        : new Role(res.rows[0].id_role, res.rows[0].name);
    } catch (err) {
      throw new Error(`Error finding all roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async findByName(roleName: string): Promise<Role | null> {
    const findQuery = {
      text: ` 
        ${BASE_ROLE_QUERY}
        WHERE r.name = $1
        GROUP BY r.id_role, r.name
    `,
      values: [roleName],
    };
    const client = await getClient();

    try {
      const res = await client.query(findQuery);

      if (res.rowCount === 0) return null;

      return res.rows[0].permissions[0].id_permission
        ? mapRowToRole(res.rows[0])
        : new Role(res.rows[0].id_permission, res.rows[0].name);
    } catch (err) {
      throw new Error(`Error finding all roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Role[]> {
    const findQuery = ` 
        ${BASE_ROLE_QUERY}
        GROUP BY r.id_role, r.name
    `;

    const client = await getClient();
    try {
      const res = await client.query(findQuery);

      if (res.rowCount === 0) return [];

      const roles = res.rows.map((row) => {
        return mapRowToRole(row);
      });
      return roles;
    } catch (err) {
      throw new Error(`Error finding all roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async update(updatedRole: Role, currentRole: Role): Promise<void> {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      // 1. Update name if it has changed
      if (currentRole?.name !== updatedRole.name) {
        await client.query(`UPDATE roles SET name = $1 WHERE id_role = $2`, [
          updatedRole.name,
          updatedRole.id,
        ]);
      }

      // 2. Calculate the permissions to add and remove
      const currentPermissions = new Set(
        currentRole?.permissions.map((p) => p.id)
      );
      const newPermissions = new Set(updatedRole.permissions.map((p) => p.id));

      const toAdd = [...newPermissions].filter(
        (id) => !currentPermissions.has(id)
      );
      const toRemove = [...currentPermissions].filter(
        (id) => !newPermissions.has(id)
      );

      // Insertar nuevos permisos
      for (const id of toAdd) {
        await client.query(
          `INSERT INTO roles_permission(id_role, id_permission) VALUES ($1, $2)`,
          [updatedRole.id, id]
        );
      }

      //Eliminar permisos que ya no estan
      for (const id of toRemove) {
        await client.query(
          `DELETE FROM roles_permissions WHERE id_role = $1 AND id_permission = $2`,
          [updatedRole.id, id]
        );
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw new Error(`Error updating role: ${err}`);
    } finally {
      client.release();
    }
  }

  async delete(roleId: number): Promise<void> {
    const client = await getClient();

    try {
      const deleteQuery = {
        text: "DELETE FROM roles WHERE id_role = $1",
        values: [roleId],
      };

      const res = await client.query(deleteQuery);

      if (res.rowCount === 0) {
        throw new Error(`Role with ID ${roleId} not found`);
      }
      return;
    } catch (err) {
      throw new Error(`Error deleting role: ${err}`);
    } finally {
      client.release();
    }
  }
}
