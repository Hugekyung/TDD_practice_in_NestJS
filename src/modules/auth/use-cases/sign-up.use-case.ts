export class SignUpUseCase {
    constructor() {}

    validatePassword(password: string): boolean {
        if (password.length < 8 || password.length > 20) {
            throw new Error('11006');
        }

        return true;
    }
}
