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

CREATE TABLE refresh_tokens (
  id_refresh_token VARCHAR(36),
  id_user VARCHAR(36),
  secret_hash VARCHAR,
  ip_address INET,
  user_agent VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE RESTRICT
);

CREATE SEQUENCE seq_permissions START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_roles START WITH 1 INCREMENT BY 1;

BEGIN;

-- Permissions
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'permissions.view.all', 'Ver lista de todos los permisos existentes'),
(nextval('seq_permissions'), 'permissions.create', 'Crear nuevos permisos'),
(nextval('seq_permissions'), 'permissions.update', 'Actualizar un permiso existente'),
(nextval('seq_permissions'), 'permissions.delete', 'Eliminar permisos');

-- Roles
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'roles.view.all', 'Ver lista de todos los roles existentes'),
(nextval('seq_permissions'), 'roles.create', 'Crear nuevos roles'),
(nextval('seq_permissions'), 'roles.update', 'Actualizar un rol existente'),
(nextval('seq_permissions'), 'roles.delete', 'Eliminar roles');

-- Users
INSERT INTO permissions (id_permission, name, description) VALUES
(nextval('seq_permissions'), 'users.view.all', 'Ver los detalles de todos los usuarios'),
(nextval('seq_permissions'), 'users.view.own', 'Ver los detalles de su propio usuario'),
(nextval('seq_permissions'), 'users.crear', 'Crear nuevos usuarios'),
(nextval('seq_permissions'), 'users.update', 'Actualizar un usuario existente'),
(nextval('seq_permissions'), 'users.delete', 'Eliminar usuarios'),



-- Roles
INSERT INTO roles (id_role, name) VALUES
(nextval('seq_roles'), 'developer'),

COMMIT;

BEGIN;

-- developer (ID 1) — todos los permisos (1 al 41)
INSERT INTO roles_permissions (id_role, id_permission)
SELECT 1, id_permission FROM generate_series(1, 13) AS id_permission;


-- Users
INSERT INTO users(id_user, username, password_hash, email, full_name) VALUES
('a9681d0e-10a3-4942-87cf-f8c6d1277981', 'developer', '$2b$10$njcrMKLIkxRM76Tx9cPQ0OD2eF5B14eP9Gej9/XnWrbCY8ZMOI4H.', 'jairosfcastro090520@gmail.com', 'Jairo Flores');

INSERT INTO users_roles(id_user, id_role) VALUES ('a9681d0e-10a3-4942-87cf-f8c6d1277981', 1);

COMMIT;

