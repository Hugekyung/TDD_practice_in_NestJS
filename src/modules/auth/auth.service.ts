import { Inject, Injectable } from '@nestjs/common';
import { SignUpUseCaseToken } from '../../common/constants/injection-tokens.constant';
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

        // [1] 비밀번호 검증
        this.signUpUseCase.validatePassword(password);

        // [2] 이메일 중복 검증
        await this.signUpUseCase.validateEmail(signUpDto.email);

        // [3] 휴대전화 번호 중복 검증
        await this.signUpUseCase.validatePhoneNumber(signUpDto.phone);

        // TODO: 회원가입
        // TODO: 비밀번호 암호화
        // TODO: 휴대전화번호 암호화
        // TODO: User 객체 생성 및 DB 저장

        return null;
    }
}
