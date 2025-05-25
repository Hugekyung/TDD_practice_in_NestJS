import { ValidatePasswordReqDto } from './sign-up.dto';

export class SignUpUseCase {
    constructor() {}

    validatePassword(requestDto: ValidatePasswordReqDto): boolean {
        const { password } = requestDto;
        if (password.length < 8) {
            console.log('password >>', password); //debug
            throw new Error('11006');
        }

        return true;
    }
}
