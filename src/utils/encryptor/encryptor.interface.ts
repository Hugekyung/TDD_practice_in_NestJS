export interface IEncryptor {
    hash(plain: string): Promise<string>;
    compare(plain: string, hashed: string): Promise<boolean>;
    encrypt(plain: string): string;
    decrypt(cipherText: string): string;
}
