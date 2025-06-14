import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IEncryptor } from './encryptor.interface';

@Injectable()
export class EncryptorService implements IEncryptor {
    private readonly saltRounds = 10;
    private readonly algorithm = 'aes-256-cbc';
    private readonly secretKey = process.env.ENCRYPT_KEY || 'my-secret-key-32byteeeeeeeeeee!'; // 32바이트
    private readonly iv = process.env.ENCRYPT_IV || '1234567890123456'; // 16바이트

    async hash(plain: string): Promise<string> {
        return await bcrypt.hash(plain, this.saltRounds);
    }

    async compare(plain: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plain, hashed);
    }

    encrypt(plain: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        let encrypted = cipher.update(plain, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    decrypt(cipherText: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.iv);
        let decrypted = decipher.update(cipherText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
