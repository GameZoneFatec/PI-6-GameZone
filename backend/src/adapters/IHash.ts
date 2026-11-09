export interface IHash {
    hashPassword(password: string): Promise<string>;
    compare(password: string, passwordHash: string): Promise<boolean>;
}
