import { IUserRepository } from './use-cases/sign-up/user-repository.interface';

export class UserRepository implements IUserRepository {
    users: { email: string; password: string; createdAt: Date }[] = [];
    constructor() {}

    async findOneByEmail(
        email: string,
    ): Promise<[{ id: number; email: string; password: string; createdAt: Date } | undefined]> {
        return await Promise.all([this.users.find((user) => user.email === email)]);
    }
}
