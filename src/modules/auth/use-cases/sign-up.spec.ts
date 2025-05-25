import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUseCase } from './sign-up.use-case';

describe('SignUpUseCase TEST', () => {
    let useCase: SignUpUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SignUpUseCase],
        }).compile();

        useCase = module.get<SignUpUseCase>(SignUpUseCase);
    });

    describe('비밀번호 검증', () => {
        it('비밀번호 길이가 8자리 보다 작으면 11006 error code를 반환한다', () => {
            // * given
            const requestDto = SignUpTestObjectFixture.getFailedSignUpReqDto();

            // * then
            expect(() => useCase.validatePassword(requestDto)).toThrow('11006');
        });
    });
});

class SignUpTestObjectFixture {
    static getFailedSignUpReqDto() {
        return {
            password: '1234',
        };
    }
}
