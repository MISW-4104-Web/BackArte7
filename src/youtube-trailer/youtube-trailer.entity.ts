import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { MovieEntity } from '../movie/movie.entity';

@Entity()
export class YoutubeTrailerEntity extends BaseEntity {
    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    duration: number;

    @Column()
    channel: string;

    @OneToOne(type => MovieEntity, movie => movie.youtubeTrailer)
    movie: MovieEntity;
}
