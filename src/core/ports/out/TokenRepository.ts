export interface TokenRepository {
  sign(payload: object, options?: object): Promise<string>;
  verify(token: string): Promise<object | undefined>;
}
