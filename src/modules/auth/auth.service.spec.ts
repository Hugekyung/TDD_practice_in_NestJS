import { Test, TestingModule } from '@nestjs/testing';
import { SignUpUseCaseToken } from '../../common/constants/injection-tokens.constant';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: SignUpUseCaseToken,
                    useValue: {
                        findOneByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('signUp Test', async () => {
        const signUpDto = { email: 'email', password: 'password', phone: '010-1234-5678' };
        service.signUp = jest.fn().mockResolvedValue(null);
        const result = await service.signUp(signUpDto);
        expect(result).toBeNull();
    });
});
