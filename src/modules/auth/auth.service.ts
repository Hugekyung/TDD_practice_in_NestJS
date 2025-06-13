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
        // * 일주일 이내 탈퇴한 계정 => 11002
        // * 탈퇴한지 7 이후, 30일 이내인 경우 => 개인정보 파기
        // * 동일한 이메일 존재 => 11004

        // TODO 3: 휴대전화 번호 중복 검증
        await this.signUpUseCase.validatePhoneNumber(signUpDto.phone);

        return null;
    }
}
