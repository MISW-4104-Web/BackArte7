import { Module } from '@nestjs/common';
import { GenreMovieService } from './genre-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from '../genre/genre.entity';
import { MovieEntity } from '../movie/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity, MovieEntity])],
  providers: [GenreMovieService]
})
export class GenreMovieModule {}
