import { Entity, OneToMany } from 'typeorm';
import { PersonEntity } from '../shared/entities/person.entity';
import { MovieEntity } from '../movie/movie.entity';

@Entity()
export class DirectorEntity extends PersonEntity {
    @OneToMany(type => MovieEntity, movie => movie.director)
    movies: MovieEntity[];
}
