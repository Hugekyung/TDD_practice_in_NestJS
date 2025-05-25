import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('비밀번호 검증', () => {
        it('비밀번호 길이가 8자리 보다 작으면 11006 error code를 반환한다', () => {
            // * given
            const requestDto = SignUpTestObjectFixture.getFailedSignUpReqDto();

            // * when
            const result = service.validatePassword(requestDto);

            // * then
            expect(result).toThrow('11006');
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
