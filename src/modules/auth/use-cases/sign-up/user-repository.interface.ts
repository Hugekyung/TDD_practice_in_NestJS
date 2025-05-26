export interface IUserRepository {
    findOneByEmail(
        email: string,
    ): Promise<[{ id: number; email: string; password: string; createdAt: Date } | undefined]>;
}
