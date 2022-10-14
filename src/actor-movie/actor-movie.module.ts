import { Module } from '@nestjs/common';
import { ActorMovieService } from './actor-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';
import { ActorMovieController } from './actor-movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, ActorEntity])],
  providers: [ActorMovieService],
  controllers: [ActorMovieController]
})
export class ActorMovieModule {}
