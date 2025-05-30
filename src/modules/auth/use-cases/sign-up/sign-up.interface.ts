export interface ISignUpUseCase {
    validatePassword(password: string): boolean;
    validateEmail(email: string);
}
