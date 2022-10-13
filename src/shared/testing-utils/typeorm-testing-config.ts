import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorEntity } from '../../actor/actor.entity';
import { DirectorEntity } from '../../director/director.entity';
import { GenreEntity } from '../../genre/genre.entity';
import { MovieEntity } from '../../movie/movie.entity';
import { PlatformEntity } from '../../platform/platform.entity';
import { ReviewEntity } from '../../review/review.entity';
import { YoutubeTrailerEntity } from '../../youtube-trailer/youtube-trailer.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ActorEntity, DirectorEntity, GenreEntity, MovieEntity, PlatformEntity, ReviewEntity, YoutubeTrailerEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ActorEntity, DirectorEntity, GenreEntity, MovieEntity, PlatformEntity, ReviewEntity, YoutubeTrailerEntity]),
];
