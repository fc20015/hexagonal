import { Permission } from "../../../core/domain/Permission.js";
import { Role } from "../../../core/domain/Role.js";
import { type RoleRepository } from "../../../core/ports/out/RoleRepository.js";
import { getClient } from "../../../infraestructure/postgres/Database.js";

type PermissionRow = {
  id_permission: number;
  name: string;
  description: string;
};

export class PostgresRoleRepository implements RoleRepository {
  async create(role: Role): Promise<number> {
    const insertQuery = {
      text: `
        INSERT INTO roles(id_role, name) VALUES (nextval('seq_roles'), $1) RETURNING id_role
      `,
      values: [role.name],
    };

    const client = await getClient();

    try {
      await client.query("BEGIN");
      const resRole = await client.query(insertQuery);
      if (resRole.rowCount === 0) throw new Error(`Cannot create role`);
      const newRoleId = resRole.rows[0].id_role;
      if (role.permissions.length > 0) {
        role.permissions.map(async (p) => {
          const insertPermission = {
            text: `INSERT INTO roles_permissions(id_role, id_permission) VALUES ($1, $2)`,
            values: [newRoleId, p.id],
          };
          await client.query(insertPermission);
        });
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
        JOIN roles_permissions rp ON r.id_role = rp.id_role
        JOIN permissions p ON rp.id_permission = p.id_permission
        WHERE r.id_role = $1
        GROUP BY r.id_role, r.name
    `,
      values: [roleId],
    };

    const client = await getClient();
    try {
      const res = await client.query(findQuery);
      if (res.rowCount === 0) return null;
      return new Role(
        res.rows[0].id_role,
        res.rows[0].name,
        res.rows[0].permissions
      );
    } catch (err) {
      throw new Error(`Error finding all roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Role[]> {
    const findQuery = ` 
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
        JOIN roles_permissions rp ON r.id_role = rp.id_role
        JOIN permissions p ON rp.id_permission = p.id_permission
        GROUP BY r.id_role, r.name
    `;

    const client = await getClient();
    try {
      const res = await client.query(findQuery);
      if (res.rowCount === 0) {
        return [];
      }
      const roles = res.rows.map((row) => {
        const permissions = row.permissions.map(
          (p: PermissionRow) =>
            new Permission(p.id_permission, p.name, p.description)
        );
        return new Role(row.id_role, row.name, permissions);
      });
      return roles;
    } catch (err) {
      throw new Error(`Error finding all roles: ${err}`);
    } finally {
      client.release();
    }
  }

  async delete(roleId: number): Promise<void> {
    const deleteQuery = {
      text: "DELETE FROM roles WHERE id_role = $1",
      values: [roleId],
    };

    const client = await getClient();
    try {
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

  async findByName(roleName: string): Promise<Role | null> {
    const findQuery = {
      text: `
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
            JOIN roles_permissions rp ON r.id_role = rp.id_role
            JOIN permissions p ON rp.id_permission = p.id_permission
            WHERE r.name = $1
            GROUP BY r.id_role, r.name
        `,
      values: [roleName],
    };

    const client = await getClient();
    try {
      const res = await client.query(findQuery);
      if (res.rowCount === 0) {
        return null;
      }
      const permissions = res.rows[0].permissions.map(
        (p: PermissionRow) =>
          new Permission(p.id_permission, p.name, p.description)
      );
      const role = new Role(res.rows[0].id_role, res.rows[0].name, permissions);
      return role;
    } catch (err) {
      throw new Error(`Error finding role by name: ${err}`);
    } finally {
      client.release();
    }
  }

  async update(role: Role): Promise<void> {
    if (!role.id) throw new Error(`ID Role is necesary`);

    const currentRole = await this.findById(role.id);
    if (!currentRole) throw new Error(`Cannot find role with ID ${role.id}`);

    const client = await getClient();

    try {
      await client.query("BEGIN");

      // 1. Actualizar el nombre si cambio
      if (currentRole.name !== role.name) {
        await client.query(`UPDATE roles SET name = $1 WHERE id_role = $2`, [
          role.name,
          role.id,
        ]);
      }

      // 2. Calcular los permisos a agregar y eliminar
      const currentPermissions = new Set(
        currentRole.permissions.map((p) => p.id)
      );
      const newPermissions = new Set(role.permissions.map((p) => p.id));

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
          [role.id, id]
        );
      }

      //Eliminar permisos que ya no estan
      for (const id of toRemove) {
        await client.query(
          `DELETE FROM roles_permissions WHERE id_role = $1 AND id_permission = $2`,
          [role.id, id]
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
}
