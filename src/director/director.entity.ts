import { Entity, OneToMany, ManyToMany } from 'typeorm';
import { PersonEntity } from '../shared/entities/person.entity';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeEntity } from '../prize/prize.entity';

@Entity()
export class DirectorEntity extends PersonEntity {
    @OneToMany(type => MovieEntity, movie => movie.director)
    movies: MovieEntity[];

    @ManyToMany(type => PrizeEntity, prize => prize.directors)
    prizes: PrizeEntity[];
}
