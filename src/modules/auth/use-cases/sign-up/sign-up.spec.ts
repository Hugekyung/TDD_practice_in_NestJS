import { Test, TestingModule } from '@nestjs/testing';
import { convert, LocalDateTime } from 'js-joda';
import {
    EncryptorServiceToken,
    UserRepositoryToken,
} from '../../../../common/constants/injection-tokens.constant';
import { IUser } from '../../../../common/database/entity/users.entity';
import { IEncryptor } from '../../../../utils/encryptor/encryptor.interface';
import { ISignUpUseCase } from './sign-up.interface';
import { SignUpUseCase } from './sign-up.use-case';
import { IUserRepository } from './user-repository.interface';

describe('SignUpUseCase TEST', () => {
    let useCase: ISignUpUseCase;
    let userRepository: IUserRepository;
    let encryptorService: IEncryptor;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignUpUseCase,
                {
                    provide: UserRepositoryToken,
                    useValue: {
                        findOneByEmail: jest.fn(),
                        findOneByPhoneNumber: jest.fn(),
                    },
                },
                {
                    provide: EncryptorServiceToken,
                    useValue: {
                        hash: jest.fn(),
                        compare: jest.fn(),
                        encrypt: jest.fn(),
                        decrypt: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<SignUpUseCase>(SignUpUseCase);
        userRepository = module.get<IUserRepository>(UserRepositoryToken);
        encryptorService = module.get<IEncryptor>(EncryptorServiceToken);
    });

    describe('validatePassword', () => {
        it.each([
            ['비밀번호 길이가 8자리 보다 작으면', 'psword'],
            ['비밀번호 길이가 20자리 보다 길면', 'password'.repeat(5)],
        ])('11006 error code를 반환한다', (_, password) => {
            expect(() => useCase.validatePassword(password)).toThrow('11006');
        });

        it('비밀번호 길이가 8자 이상 20자 이하이면 true를 반환한다', () => {
            // * given
            const password = 'password1234';

            // * when
            const result = useCase.validatePassword(password);

            // * then
            expect(result).toBeTruthy();
        });
    });

    describe('validateEmail', () => {
        const now = LocalDateTime.now();
        const createdAt = convert(now).toDate();
        const mockUser: IUser = {
            id: 2,
            email: 'test@example.com',
            password: 'user123444',
            phone: '01012345677',
            createdAt,
            deletedAt: null,
        };

        it('동일한 이메일이 존재할 경우 11004 error code를 반환한다', async () => {
            // * given: userRepository.findOne() mocked
            jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValue(mockUser);

            // * then
            await expect(useCase.validateEmail(mockUser.email)).rejects.toThrow('11004');
        });

        it('탈퇴한지 일주일 이내 계정인 경우 11002 error code를 반환한다', async () => {
            // * given
            const email = 'test2@example.com'; // * 존재하지 않는 이메일
            mockUser.deletedAt = convert(now.minusDays(3)).toDate();
            jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValue(mockUser);

            // * when & then
            await expect(useCase.validateEmail(email)).rejects.toThrow('11002');
        });
    });

    describe('validatePhoneNumber', () => {
        const mockUser: IUser = {
            id: 2,
            email: 'test@example.com',
            password: 'user123444',
            phone: '01012345677',
            createdAt: new Date(),
            deletedAt: null,
        };

        it('휴대전화번호로 유저가 검색되지 않으면 true 값을 반환한다', async () => {
            // * given
            const registPhoneNumber = '01012345678';

            // * when
            jest.spyOn(userRepository, 'findOneByPhoneNumber').mockResolvedValue(null);

            // * then
            await expect(useCase.validatePhoneNumber(registPhoneNumber)).resolves.toBeTruthy();
        });

        it('휴대전화번호를 이미 사용하고 있으면 11005 error code를 반환한다', async () => {
            // * given
            const phoneNumber = '01012345678';

            // * when
            jest.spyOn(userRepository, 'findOneByPhoneNumber').mockResolvedValue(mockUser);

            // * then
            await expect(useCase.validatePhoneNumber(phoneNumber)).rejects.toThrow('11005');
        });
    });

    describe('createUser', () => {
        it('비밀번호 암호화를 위해 encryptPassword 메서드를 한번 호출하고, 암호화된 비밀번호를 반환한다', async () => {
            // * given
            const originalPassword = 'password1234';
            const hashedPassword = 'hashedPassword';
            const hashPasswordSpy = jest.spyOn(encryptorService, 'hash').mockResolvedValue(hashedPassword); // ! mockResolvedValue: Promise를 반환하는 메서드를 모킹할 때 사용
            // * when
            const result = await useCase.encryptPassword(originalPassword);

            // * then
            expect(hashPasswordSpy).toHaveBeenCalledWith(originalPassword);
            expect(result).toBe(hashedPassword);
        });

        it('휴대전화번호는 암호화되어야 한다', () => {
            // * given
            const originPhoneNumber = '01012345678';
            const encryptedPhoneNumber = 'encryptedPhoneNumber';
            const encryptPhoneNumberSpy = jest
                .spyOn(encryptorService, 'encrypt')
                .mockReturnValue(encryptedPhoneNumber); // ! mockReturnValue: Promise를 반환하지 않는 메서드를 모킹할 때 사용

            // * when
            const result = useCase.encryptPhoneNumber(originPhoneNumber);

            // * then
            expect(encryptPhoneNumberSpy).toHaveBeenCalledWith(originPhoneNumber);
            expect(result).toBe(encryptedPhoneNumber);
        });
    });

    describe('signIn', () => {
        it('이메일 정보가 없으면 11006 error code를 반환한다', async () => {});
        it('비밀번호가 일치하지 않으면 11007 error code를 반환한다', async () => {});
    });
});
