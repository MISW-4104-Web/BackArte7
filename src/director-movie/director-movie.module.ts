import { Module } from '@nestjs/common';
import { DirectorMovieService } from './director-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorEntity } from '../director/director.entity';
import { MovieEntity } from '../movie/movie.entity';
import { DirectorMovieController } from './director-movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DirectorEntity, MovieEntity])],
  providers: [DirectorMovieService],
  controllers: [DirectorMovieController]
})
export class DirectorMovieModule { }
