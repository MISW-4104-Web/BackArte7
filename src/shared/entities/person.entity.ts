import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export class PersonEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    photo: string;

    @Column()
    nationality: string;

    @Column()
    birthDate: Date;

    @Column()
    biography: string;
}
