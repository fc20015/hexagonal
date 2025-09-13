import type { EncryptionRepository } from "../../../core/ports/out/EncryptionRepository.js";
import bcrypt from "bcrypt";

export class BcryptEncryptionRepository implements EncryptionRepository {
  hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
