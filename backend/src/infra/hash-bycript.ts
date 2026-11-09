import { IHash } from '../adapters/IHash';
import bcrypt from 'bcryptjs';

export class HashBcrypt implements IHash {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    async compare(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash);
    }
}
