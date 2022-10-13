import { Column, Entity, OneToMany } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { BaseEntity } from '../shared/entities/base.entity';

@Entity()
export class GenreEntity extends BaseEntity {
    @Column()
    type: string;

    @OneToMany(type => MovieEntity, movie => movie.genre)
    movies: MovieEntity[];
}
