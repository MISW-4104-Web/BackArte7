import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { DirectorEntity } from '../director/director.entity';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';

@Entity()
export class PrizeEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    year: number;

    @Column()
    status: string; // 'won' or 'nominated'

    @ManyToMany(type => DirectorEntity, director => director.prizes)
    @JoinTable()
    directors: DirectorEntity[];

    @ManyToMany(type => MovieEntity, movie => movie.prizes)
    @JoinTable()
    movies: MovieEntity[];

    @ManyToMany(type => ActorEntity, actor => actor.prizes)
    @JoinTable()
    actors: ActorEntity[];
}
