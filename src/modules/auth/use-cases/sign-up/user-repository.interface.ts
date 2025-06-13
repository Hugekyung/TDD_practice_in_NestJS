import { IUser } from 'src/common/database/entity/users.entity';

export interface IUserRepository {
    findOneByEmail(email: string): Promise<IUser | null>;
    findOneByPhoneNumber(phone: string): Promise<IUser | null>;
}
