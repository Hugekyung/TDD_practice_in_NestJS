import { Inject } from '@nestjs/common';
import { LocalDate, nativeJs } from 'js-joda';
import {
    EncryptorServiceToken,
    UserRepositoryToken,
} from '../../../../common/constants/injection-tokens.constant';
import { EncryptorService } from '../../../../utils/encryptor/encryptor.service';
import { ISignUpUseCase } from './sign-up.interface';
import { IUserRepository } from './user-repository.interface';

export class SignUpUseCase implements ISignUpUseCase {
    constructor(
        @Inject(UserRepositoryToken)
        private readonly userRepository: IUserRepository,
        @Inject(EncryptorServiceToken)
        private readonly encryptorService: EncryptorService,
    ) {}

    validatePassword(password: string): boolean {
        if (password.length < 8 || password.length > 20) {
            throw new Error('11006');
        }

        return true;
    }

    async validateEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            return true; // * 동일 이메일로 가입자 없음. 가입 가능
        }

        // * 동일한 이메일 존재 => 11004
        if (user.email === email) {
            console.log('동일한 이메일 !');
            throw new Error('11004');
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

        return true;
    }

    async validatePhoneNumber(phone: string): Promise<boolean> {
        const user = await this.userRepository.findOneByPhoneNumber(phone); // TODO: hashed 기반으로 검색 필요
        if (!user) {
            return true; // * 동일 휴대전화번호로 가입자 없음. 가입 가능
        }

        if (user) {
            throw new Error('11005');
        }

        return true;
    }

    async encryptPassword(password: string): Promise<string> {
        return await this.encryptorService.hash(password);
    }

    encryptPhoneNumber(phone: string): string {
        return this.encryptorService.encrypt(phone);
    }
}
