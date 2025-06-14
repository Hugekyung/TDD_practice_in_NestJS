export interface ISignUpUseCase {
    validatePassword(password: string): boolean;
    validateEmail(email: string): Promise<boolean>;
    validatePhoneNumber(phone: string): Promise<boolean>;
    encryptPassword(password: string): Promise<string>;
    encryptPhoneNumber(phone: string): string;
}
