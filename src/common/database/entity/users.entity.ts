import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IUser {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    deletedAt: Date | null;
}

@Entity({ name: 'Users' })
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, comment: '이메일' })
    email: string;

    @Column({ type: 'varchar', length: 1000, comment: '비밀번호(암호)' })
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, comment: '삭제일시' })
    deletedAt: Date | null;
}
