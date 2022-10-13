import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
}

