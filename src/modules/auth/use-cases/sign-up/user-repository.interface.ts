import { IUser } from 'src/common/database/entity/users.entity';
import { CreateUserDto } from '../../dto/create-user.dto';

export interface IUserRepository {
    findOneByEmail(email: string): Promise<IUser | null>;
    findOneByPhoneNumber(phone: string): Promise<IUser | null>;
    create(createUserDto: CreateUserDto): IUser;
    save(user: IUser): Promise<IUser>;
}
