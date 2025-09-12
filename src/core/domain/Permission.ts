export class Permission {
  private _id: number | null;
  private _name: string;
  private _description: string;

  constructor(id: number | null, name: string, description: string) {
    this._id = id;
    this._name = name;
    this._description = description;
  }

  get id(): number | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  set name(name: string) {
    this._name = name;
  }

  set description(description: string) {
    this._description = description;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
    };
  }
}
