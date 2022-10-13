import { Module } from '@nestjs/common';
import { DirectorMovieService } from './director-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorEntity } from '../director/director.entity';
import { MovieEntity } from '../movie/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DirectorEntity, MovieEntity])],
  providers: [DirectorMovieService]
})
export class DirectorMovieModule {}
