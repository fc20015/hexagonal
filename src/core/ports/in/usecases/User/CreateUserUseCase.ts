import type { UserRepository } from "../../../out/UserRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import { User } from "../../../../domain/User.js";
import { UserEmail } from "../../../../domain/UserEmail.js";
import { v4 as uuidv4 } from "uuid";
import { UserAlreadyExistsError } from "../../../../domain/errors.js";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private encryptionRepository: EncryptionRepository
  ) {}

  async execute(
    username: string,
    password: string,
    email: string,
    full_name: string
  ): Promise<string> {
    const existingUserByUsername = await this.userRepository.getUserByUsername(
      username
    );
    if (existingUserByUsername) {
      throw new UserAlreadyExistsError("Username is not available");
    }

    const id_user = uuidv4();
    const password_hash = await this.encryptionRepository.hash(password);
    const userEmail = new UserEmail(email);
    const created_at = new Date();
    const updated_at = new Date();
    const is_active = true;

    const newUser = new User(
      id_user,
      username,
      password_hash,
      userEmail,
      full_name,
      is_active,
      created_at,
      updated_at
    );

    return this.userRepository.createUser(newUser);
  }
}
