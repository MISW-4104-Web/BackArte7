import { Module } from '@nestjs/common';
import { GenreMovieService } from './genre-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../genre/genre.entity';
import { MovieEntity } from '../movie/movie.entity';
import { GenreMovieController } from './genre-movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity, MovieEntity])],
  providers: [GenreMovieService],
  controllers: [GenreMovieController]
})
export class GenreMovieModule { }
