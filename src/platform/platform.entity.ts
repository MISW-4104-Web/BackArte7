import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { MovieEntity } from '../movie/movie.entity';

@Entity()
export class PlatformEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    url: string;

    @ManyToMany(type => MovieEntity, movie => movie.platforms)
    @JoinTable()
    movies: MovieEntity[];
}
