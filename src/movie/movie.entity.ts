import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { BaseEntity } from '../shared/entities/base.entity';
import { DirectorEntity } from '../director/director.entity';
import { ActorEntity } from '../actor/actor.entity';
import { GenreEntity } from '../genre/genre.entity';
import { PlatformEntity } from '../platform/platform.entity';
import { ReviewEntity } from '../review/review.entity';
import { YoutubeTrailerEntity } from '../youtube-trailer/youtube-trailer.entity';

@Entity()
export class MovieEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    poster: string;

    @Column()
    duration: number;

    @Column()
    country: string;

    @Column()
    releaseDate: Date;

    @Column()
    popularity: number;

    @ManyToOne(type => DirectorEntity, director => director.movies)
    director: DirectorEntity;

    @ManyToMany(type => ActorEntity, actor => actor.movies)
    @JoinTable()
    actors: ActorEntity[];

    @ManyToOne(type => GenreEntity, genre => genre.movies)
    genre: GenreEntity;

    @ManyToMany(type => PlatformEntity, platform => platform.movies)
    platforms: PlatformEntity[];

    @OneToMany(type => ReviewEntity, review => review.movie)
    reviews: ReviewEntity[];

    @OneToOne(type => YoutubeTrailerEntity, youtubeTrailer => youtubeTrailer.movie)
    @JoinColumn()
    youtubeTrailer: YoutubeTrailerEntity;
}
