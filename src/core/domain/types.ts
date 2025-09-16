export interface PermissionRow {
  id: number;
  name: string;
  description: string;
}

export interface RoleRow {
  id: number;
  name: string;
  permissions?: PermissionRow[];
}

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  roles: RoleRow[];
  permissions: PermissionRow[];
}

export interface UserRefreshToken {
  id: string;
  secret: string;
  secretHash: string;
  expiresAt: Date;
}
