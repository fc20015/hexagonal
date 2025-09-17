export class RefreshToken {
  private _id: string;
  private _id_user: string;
  private _secret_hash: string;
  private _remote_address: string;
  private _user_agent: string;
  private _created_at: Date | null;
  private _revoked: boolean;
  private _revoked_at: Date | null;

  constructor(
    id: string,
    id_user: string,
    secret_hash: string,
    remote_address: string,
    user_agent: string,
    created_at: Date | null = null,
    revoked: boolean = false,
    revoked_at: Date | null = null
  ) {
    this._id = id;
    this._id_user = id_user;
    this._secret_hash = secret_hash;
    this._remote_address = remote_address;
    this._user_agent = user_agent;
    this._created_at = created_at;
    this._revoked = revoked;
    this._revoked_at = revoked_at;
  }

  get id(): string {
    return this._id;
  }

  get id_user(): string {
    return this._id_user;
  }

  get secret_hash(): string {
    return this._secret_hash;
  }

  get remote_address(): string {
    return this._remote_address;
  }

  get user_agent(): string {
    return this._user_agent;
  }

  get created_at(): Date | null {
    return this._created_at;
  }

  get revoked(): boolean {
    return this._revoked;
  }

  get revoked_at(): Date | null {
    return this._revoked_at;
  }

  toJSON() {
    return {
      id: this._id,
      user: this._id_user,
      secretHash: this._secret_hash,
      remoteAddr: this._remote_address,
      userAgent: this._user_agent,
      revoked: this._revoked,
      revokedAt: this._revoked_at,
    };
  }
}
