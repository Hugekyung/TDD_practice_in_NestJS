import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser, User } from '../../common/database/entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRepository } from './use-cases/sign-up/user-repository.interface';

export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<IUser>,
    ) {}

    async findOneByEmail(email: string): Promise<IUser | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findOneByPhoneNumber(phone: string): Promise<IUser | null> {
        return await this.userRepository.findOne({ where: { phone } });
    }

    create(createUserDto: CreateUserDto): IUser {
        return this.userRepository.create(createUserDto);
    }

    async save(user: IUser): Promise<IUser> {
        return await this.userRepository.save(user);
    }
}
