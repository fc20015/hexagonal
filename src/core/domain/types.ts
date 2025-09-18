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

export interface RefreshTokenRow {
  id: string;
  user: string;
  secret_hash: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  revoked: boolean;
  revoked_at: Date;
}

export interface BrowserInfo {
  ip_address: string;
  user_agent: string;
}

export interface TokensSession {
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  full_name: string;
  permissions: string[];
}
