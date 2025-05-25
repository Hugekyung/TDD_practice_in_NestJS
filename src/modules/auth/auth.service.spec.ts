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

    it('test', async () => {
        service.signUp = jest.fn().mockResolvedValue(null);
        const result = await service.signUp();
        expect(result).toBeNull();
    });
});
