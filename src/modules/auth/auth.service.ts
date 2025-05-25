import { Inject, Injectable } from '@nestjs/common';
import { SignUpUseCaseToken } from 'src/common/constants/injection-tokens.constant';
import { SignUpReqDto } from './dto/sign-up.dto';
import { ISignUpUseCase } from './use-cases/sign-up/sign-up.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(SignUpUseCaseToken)
        private readonly signUpUseCase: ISignUpUseCase,
    ) {}
    async signUp(signUpDto: SignUpReqDto) {
        const { password } = signUpDto;

        // todo 1: 비밀번호 검증
        this.signUpUseCase.validatePassword(password);
        return null;
    }
}
