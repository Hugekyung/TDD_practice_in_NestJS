import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpUseCase } from './use-cases/sign-up.use-case';

@Module({
    controllers: [AuthController],
    providers: [AuthService, SignUpUseCase],
})
export class AuthModule {}
