import { Entity, ManyToMany } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { PersonEntity } from '../shared/entities/person.entity';

@Entity()
export class ActorEntity extends PersonEntity {
    @ManyToMany(type => MovieEntity, movie => movie.actors)
    movies: MovieEntity[];
}
