import type { UserRepository } from "../../../out/UserRepository.js";
import type { EncryptionRepository } from "../../../out/EncryptionRepository.js";
import type { TokenRepository } from "../../../out/TokenRepository.js";
import { AuthenticationError } from "../../../../domain/errors.js";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionRepository: EncryptionRepository,
    private readonly tokenRepository: TokenRepository
  ) {}

  async execute(username: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserBy("username", username);
    if (!user) throw new AuthenticationError(`Invalid credentials.`);

    console.log(user);

    const passwordsMatch = await this.encryptionRepository.compare(
      password,
      user.password_hash
    );

    if (!passwordsMatch)
      throw new AuthenticationError(`The username or password is incorrect`);

    const userProfile = await this.userRepository.getUserProfile(user.id_user);

    const allPermissions = [
      ...userProfile.roles.flatMap((role) => role.permissions),
      ...userProfile.permissions,
    ];

    const uniquePermissionsSet = new Set(allPermissions.map((p) => p.name));

    const payload = {
      id: userProfile.id_user,
      username: userProfile.username,
      full_name: userProfile.full_name,
      permissions: [...uniquePermissionsSet],
    };

    const options = {
      expiresIn: "15m",
      issuer: "hotfix-api",
      audience: "hotfix-api-frontend",
      subject: userProfile.id_user,
    };

    const token = await this.tokenRepository.sign(payload, options);

    return token;
  }
}
