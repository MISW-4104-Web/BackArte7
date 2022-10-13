import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from '../movie/movie.dto';
import { MovieEntity } from '../movie/movie.entity';
import { GenreMovieService } from './genre-movie.service';

@Controller('genres/:genreId/movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class GenreMovieController {
    constructor(private readonly genreMovieService: GenreMovieService) { }

    @Get()
    async findMoviesFromGenre(@Param('genreId') genreId: string): Promise<MovieEntity[]> {
        return await this.genreMovieService.findMoviesFromGenre(genreId);
    }

    @Get(':movieId')
    async findOne(@Param('genreId') genreId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.genreMovieService.findMovieFromGenre(genreId, movieId);
    }

    @Post(':movieId')
    async addMovieToGenre(@Param('genreId') genreId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.genreMovieService.addMovieToGenre(genreId, movieId);
    }

    @Put()
    async updateMoviesFromGenre(@Param('genreId') genreId: string, @Body() moviesDto: MovieDto[]): Promise<MovieEntity[]> {
        return await this.genreMovieService.updateMoviesFromGenre(genreId, plainToInstance(MovieEntity, moviesDto));
    }

    /*@Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('genreId') genreId: string, @Param('movieId') movieId: string): Promise<void> {
        await this.genreMovieService.delete(genreId, movieId);
    }*/

}
