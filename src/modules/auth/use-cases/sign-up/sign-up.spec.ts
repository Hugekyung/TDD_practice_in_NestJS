import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryToken } from '../../../../common/constants/injection-tokens.constant';
import { SignUpUseCase } from './sign-up.use-case';
import { IUserRepository } from './user-repository.interface';

describe('SignUpUseCase TEST', () => {
    let useCase: SignUpUseCase;
    let userRepository: IUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignUpUseCase,
                {
                    provide: UserRepositoryToken,
                    useValue: {
                        findOneByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<SignUpUseCase>(SignUpUseCase);
        userRepository = module.get<IUserRepository>(UserRepositoryToken);
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
        const mockUser: {
            id: number;
            email: string;
            password: string;
            createdAt: Date;
            deletedAt: Date | null;
        } = {
            id: 2,
            email: 'test@example.com',
            password: 'user123444',
            createdAt: new Date('2025-05-26'),
            deletedAt: null,
        };

        beforeAll(() => {
            // * given: userRepository.findOne() mocked
            jest.spyOn(useCase['userRepository'], 'findOneByEmail').mockResolvedValue(mockUser);
        });

        it('탈퇴한지 일주일 이내 계정인 경우 11002 error code를 반환한다', async () => {
            mockUser.deletedAt = new Date('2025-05-25');
            jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValue(mockUser);

            // * when & then
            await expect(useCase.validateEmail(mockUser.email)).rejects.toThrow('11002');
        });

        it('탈퇴한지 7일 이후, 30일 이내인 경우 개인정보 파기 메서드를 실행한다', () => {});

        it('동일한 이메일이 존재할 경우 11004 error code를 반환한다', () => {
            // * given: userRepository.findOne() mocked
            jest.spyOn(useCase['userRepository'], 'findOneByEmail').mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'user123444',
                createdAt: new Date('2025-05-25'),
                deletedAt: null,
            });

            // * then
            expect(async () => await useCase.validateEmail(mockUser.email)).toThrow('11004');
        });
    });
});
