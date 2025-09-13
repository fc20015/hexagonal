import { Permission } from "./Permission.js";

export class Role {
  private _id: number | null;
  private _name: string;
  private _permissions: Permission[];

  constructor(id: number | null, name: string, permissions: Permission[] = []) {
    this._id = id;
    this._name = name;
    this._permissions = permissions;
  }

  get id(): number | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  set name(name: string) {
    this._name = name;
  }

  addPermission(permission: Permission): void {
    if (!this._permissions.find((p) => p.id === permission.id)) {
      this._permissions.push(permission);
    }
  }

  removePermission(permissionId: number): void {
    this._permissions = this._permissions.filter((p) => p.id !== permissionId);
  }

  hasPermission(permissionName: string): boolean {
    return this._permissions.some((p) => p.name === permissionName);
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      permissions: this._permissions,
    };
  }
}
