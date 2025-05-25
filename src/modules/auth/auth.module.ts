import { Module } from '@nestjs/common';
import { SignUpUseCaseToken } from '../../common/constants/injection-tokens.constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpUseCase } from './use-cases/sign-up/sign-up.use-case';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        SignUpUseCase,
        {
            provide: SignUpUseCaseToken,
            useClass: SignUpUseCase,
        },
    ],
})
export class AuthModule {}
