import { Inject, Injectable } from '@nestjs/common';
import { SignUpUseCaseToken, UserRepositoryToken } from '../../common/constants/injection-tokens.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUpReqDto } from './dto/sign-up.dto';
import { ISignUpUseCase } from './use-cases/sign-up/sign-up.interface';
import { IUserRepository } from './use-cases/sign-up/user-repository.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject(SignUpUseCaseToken)
        private readonly signUpUseCase: ISignUpUseCase,
        @Inject(UserRepositoryToken)
        private readonly userRepository: IUserRepository,
    ) {}

    async signUp(signUpDto: SignUpReqDto) {
        const { email, phone, password } = signUpDto;

        // [1] 비밀번호 검증
        this.signUpUseCase.validatePassword(password);

        // [2] 이메일 중복 검증
        await this.signUpUseCase.validateEmail(email);

        // [3] 휴대전화 번호 중복 검증
        await this.signUpUseCase.validatePhoneNumber(phone);

        // [4] 비밀번호 암호화
        const hashedPassword = await this.signUpUseCase.encryptPassword(password);

        // [5] 휴대전화번호 암호화
        const encryptedPhoneNumber = this.signUpUseCase.encryptPhoneNumber(phone);

        // [6] User 객체 생성 및 DB 저장
        const createUserDto = { email, phone: encryptedPhoneNumber, password: hashedPassword };
        await this.createUserObject(createUserDto);

        return '회원가입 완료 ! ';
    }

    async createUserObject(createUserDto: CreateUserDto): Promise<void> {
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
        return;
    }
}
