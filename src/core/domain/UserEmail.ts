import { InvalidEmailError } from "./errors.js";

export class UserEmail {
  private _email: string;

  constructor(email: string) {
    this._email = email;
    if (!this.validateEmail(this._email)) {
      throw new InvalidEmailError("Invalid email format");
    }
  }

  get email(): string {
    return this._email;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON() {
    return {
      email: this._email,
    };
  }
}
