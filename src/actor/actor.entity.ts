import { Entity, ManyToMany } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { PersonEntity } from '../shared/entities/person.entity';
import { DirectorEntity } from 'src/director/director.entity';
import { PrizeEntity } from '../prize/prize.entity';

@Entity()
export class ActorEntity extends PersonEntity {
    @ManyToMany(type => MovieEntity, movie => movie.actors)
    movies: MovieEntity[];

    @ManyToMany(type => PrizeEntity, prize => prize.actors)
    prizes: PrizeEntity[];
}
