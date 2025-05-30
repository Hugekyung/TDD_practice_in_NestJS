import { Inject } from '@nestjs/common';
import { LocalDate, nativeJs } from 'js-joda';
import { UserRepositoryToken } from '../../../../common/constants/injection-tokens.constant';
import { ISignUpUseCase } from './sign-up.interface';
import { IUserRepository } from './user-repository.interface';

export class SignUpUseCase implements ISignUpUseCase {
    constructor(
        @Inject(UserRepositoryToken)
        private readonly userRepository: IUserRepository,
    ) {}

    validatePassword(password: string): boolean {
        if (password.length < 8 || password.length > 20) {
            throw new Error('11006');
        }

        return true;
    }

    // todo 2: 이메일 중복 검증
    async validateEmail(email: string) {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            return true; // * 동일 이메일로 가입자 없음. 가입 가능
        }

        // * 일주일 이내 탈퇴한 계정 => 11002
        const now = LocalDate.now();
        if (user.deletedAt) {
            const oneWeekAgo = now.minusWeeks(1);
            const userDeletedAt = LocalDate.from(nativeJs(user.deletedAt));
            if (user && oneWeekAgo.isBefore(userDeletedAt)) {
                throw new Error('11002');
            }
        }
        // * 탈퇴한지 7 이후, 30일 이내인 경우 => 개인정보 파기
        // * 동일한 이메일 존재 => 11004

        return;
    }
}
