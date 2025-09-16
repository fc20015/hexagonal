CREATE TABLE permissions (
  id_permission INT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id_permission)
);

CREATE TABLE roles (
  id_role INT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_role)
);

CREATE TABLE roles_permissions (
  id_role INT,
  id_permission INT,
  PRIMARY KEY (id_role, id_permission),
  FOREIGN KEY (id_role) REFERENCES roles(id_role) ON DELETE CASCADE,
  FOREIGN KEY (id_permission) REFERENCES permissions(id_permission) ON DELETE RESTRICT
);

CREATE TABLE "users" (
  id_user VARCHAR(36),
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_user)
);

CREATE TABLE users_roles (
  id_user VARCHAR(36),
  id_role INT,
  PRIMARY KEY (id_user, id_role),
  FOREIGN KEY (id_user) REFERENCES "users"(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_role) REFERENCES roles(id_role) ON DELETE RESTRICT
);

CREATE TABLE users_permissions (
  id_user VARCHAR(36),
  id_permission INT,
  PRIMARY KEY (id_user, id_permission),
  FOREIGN KEY (id_user) REFERENCES "users"(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_permission) REFERENCES permissions(id_permission) ON DELETE RESTRICT
);

CREATE SEQUENCE seq_permissions START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_roles START WITH 1 INCREMENT BY 1;

BEGIN;

-- Products
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'products.view', 'Ver lista y detalles de productos'),
(nextval('seq_permissions'), 'products.create', 'Crear nuevos productos'),
(nextval('seq_permissions'), 'products.update', 'Editar productos existentes'),
(nextval('seq_permissions'), 'products.delete', 'Eliminar productos'),
(nextval('seq_permissions'), 'products.adjust_stock', 'Ajustar inventario manualmente'),
(nextval('seq_permissions'), 'products.import', 'Importar productos desde archivo');

-- Invoices
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'invoices.view', 'Ver facturas'),
(nextval('seq_permissions'), 'invoices.create', 'Crear facturas nuevas'),
(nextval('seq_permissions'), 'invoices.update', 'Editar facturas'),
(nextval('seq_permissions'), 'invoices.cancel', 'Anular o cancelar facturas'),
(nextval('seq_permissions'), 'invoices.send', 'Enviar factura electrónicamente'),
(nextval('seq_permissions'), 'invoices.download', 'Descargar factura en PDF o XML');

-- Sales
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'sales.view', 'Ver ventas realizadas'),
(nextval('seq_permissions'), 'sales.create', 'Registrar una venta'),
(nextval('seq_permissions'), 'sales.refund', 'Registrar una devolución o reembolso'),
(nextval('seq_permissions'), 'sales.report', 'Acceder a reportes de ventas');

-- Purchases
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'purchases.view', 'Ver órdenes de compra'),
(nextval('seq_permissions'), 'purchases.create', 'Registrar compras nuevas'),
(nextval('seq_permissions'), 'purchases.update', 'Editar compras'),
(nextval('seq_permissions'), 'purchases.approve', 'Aprobar una orden de compra');

-- Reports
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'reports.view', 'Ver paneles y reportes'),
(nextval('seq_permissions'), 'reports.export', 'Exportar reportes');

-- Clients
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'clients.view', 'Ver clientes'),
(nextval('seq_permissions'), 'clients.create', 'Agregar nuevo cliente'),
(nextval('seq_permissions'), 'clients.update', 'Editar información del cliente'),
(nextval('seq_permissions'), 'clients.delete', 'Eliminar cliente');

-- Users
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'users.view', 'Ver usuarios'),
(nextval('seq_permissions'), 'users.create', 'Crear nuevos usuarios'),
(nextval('seq_permissions'), 'users.update', 'Editar usuarios'),
(nextval('seq_permissions'), 'users.delete', 'Eliminar usuarios'),
(nextval('seq_permissions'), 'users.assign_roles', 'Asignar roles o permisos a usuarios');

-- Roles
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'roles.view', 'Ver roles definidos'),
(nextval('seq_permissions'), 'roles.create', 'Crear nuevos roles'),
(nextval('seq_permissions'), 'roles.update', 'Modificar permisos de un rol'),
(nextval('seq_permissions'), 'roles.delete', 'Eliminar roles');

-- Settings
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'settings.view', 'Ver configuración del sistema'),
(nextval('seq_permissions'), 'settings.update', 'Cambiar parámetros de configuración'),
(nextval('seq_permissions'), 'settings.billing', 'Configurar facturación electrónica');

-- Credit Notes
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'credit_notes.view', 'Ver notas de crédito'),
(nextval('seq_permissions'), 'credit_notes.create', 'Crear nota de crédito'),
(nextval('seq_permissions'), 'credit_notes.cancel', 'Anular nota de crédito');


-- Roles
INSERT INTO roles (id_role, name) VALUES
(nextval('seq_roles'), 'admin'),
(nextval('seq_roles'), 'ventas'),
(nextval('seq_roles'), 'almacen'),
(nextval('seq_roles'), 'compras'),
(nextval('seq_roles'), 'supervisor'),
(nextval('seq_roles'), 'soporte');

COMMIT;

BEGIN;

-- admin (ID 1) — todos los permisos (1 al 41)
INSERT INTO roles_permissions (id_role, id_permission)
SELECT 1, id_permission FROM generate_series(1, 41) AS id_permission;

-- ventas (ID 2) — invoices, sales, partial clients, view products, view reports
INSERT INTO roles_permissions (id_role, id_permission) VALUES
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), -- invoices.*
(2, 13), (2, 14), (2, 15), (2, 16),                -- sales.*
(2, 23), (2, 24), (2, 25),                         -- clients.view, create, update
(2, 1),                                            -- products.view
(2, 21);                                           -- reports.view

-- almacen (ID 3) — products.*, purchases.view, sales.view, reports.view
INSERT INTO roles_permissions (id_role, id_permission) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6),     -- products.*
(3, 17),                                           -- purchases.view
(3, 13),                                           -- sales.view
(3, 21);                                           -- reports.view

-- compras (ID 4) — purchases.*, products.view, reports.view
INSERT INTO roles_permissions (id_role, id_permission) VALUES
(4, 17), (4, 18), (4, 19), (4, 20),                -- purchases.*
(4, 1),                                            -- products.view
(4, 21);                                           -- reports.view

-- supervisor (ID 5) — reports.*, invoices.view, sales.view, purchases.view, clients.view
INSERT INTO roles_permissions (id_role, id_permission) VALUES
(5, 21), (5, 22),                                  -- reports.*
(5, 7),                                            -- invoices.view
(5, 13),                                           -- sales.view
(5, 17),                                           -- purchases.view
(5, 23);                                           -- clients.view                        

-- soporte (ID 6) — users.view, roles.view, settings.view
INSERT INTO roles_permissions (id_role, id_permission) VALUES
(6, 27),                                           -- users.view
(6, 32),                                           -- roles.view
(6, 36);

-- Users
INSERT INTO users(id_user, username, password_hash, email, full_name) VALUES
('a9681d0e-10a3-4942-87cf-f8c6d1277981', 'developer', '$2b$10$njcrMKLIkxRM76Tx9cPQ0OD2eF5B14eP9Gej9/XnWrbCY8ZMOI4H.', 'jairosfcastro090520@gmail.com', 'Jairo Flores');

COMMIT;

