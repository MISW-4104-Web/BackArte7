import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { DirectorModule } from './director/director.module';
import { ActorModule } from './actor/actor.module';
import { GenreModule } from './genre/genre.module';
import { PlatformModule } from './platform/platform.module';
import { ReviewModule } from './review/review.module';
import { YoutubeTrailerModule } from './youtube-trailer/youtube-trailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieActorModule } from './movie-actor/movie-actor.module';
import { PlatformMovieModule } from './platform-movie/platform-movie.module';
import { ActorMovieModule } from './actor-movie/actor-movie.module';
import { MoviePlatformModule } from './movie-platform/movie-platform.module';
import { ActorEntity } from './actor/actor.entity';
import { MovieEntity } from './movie/movie.entity';
import { DirectorEntity } from './director/director.entity';
import { PlatformEntity } from './platform/platform.entity';
import { GenreEntity } from './genre/genre.entity';
import { ReviewEntity } from './review/review.entity';
import { YoutubeTrailerEntity } from './youtube-trailer/youtube-trailer.entity';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [
    MovieModule, 
    DirectorModule, 
    ActorModule, 
    GenreModule, 
    PlatformModule, 
    ReviewModule, 
    YoutubeTrailerModule,
    MovieActorModule,
    PlatformMovieModule,
    ActorMovieModule,
    MoviePlatformModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'arte7',
      entities: ['dist/**/*.entity.js'],
      dropSchema: true,
      synchronize: true,
      migrations: [__dirname + '/shared/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
