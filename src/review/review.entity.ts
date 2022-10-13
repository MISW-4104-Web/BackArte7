import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { MovieEntity } from '../movie/movie.entity';

@Entity()
export class ReviewEntity extends BaseEntity {
    @Column()
    text: string;

    @Column()
    score: number;

    @Column()
    creator: string;

    @ManyToOne(type => MovieEntity, movie => movie.reviews)
    movie: MovieEntity;
}
