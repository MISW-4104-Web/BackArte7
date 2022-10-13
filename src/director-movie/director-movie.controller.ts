import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from '../movie/movie.dto';
import { MovieEntity } from '../movie/movie.entity';
import { DirectorMovieService } from './director-movie.service';

@Controller('directors/:directorId/movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class DirectorMovieController {
    constructor(private readonly directorMovieService: DirectorMovieService) { }

    @Get()
    async findMoviesFromDirector(@Param('directorId') directorId: string): Promise<MovieEntity[]> {
        return await this.directorMovieService.findMoviesFromDirector(directorId);
    }

    @Get(':movieId')
    async findOne(@Param('directorId') directorId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.directorMovieService.findMovieFromDirector(directorId, movieId);
    }

    @Post(':movieId')
    async addMovieToDirector(@Param('directorId') directorId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.directorMovieService.addMovieToDirector(directorId, movieId);
    }

    @Put()
    async updateMoviesFromDirector(@Param('directorId') directorId: string, @Body() moviesDto: MovieDto[]): Promise<MovieEntity[]> {
        return await this.directorMovieService.updateMoviesFromDirector(directorId, plainToInstance(MovieEntity, moviesDto));
    }

    /*@Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('directorId') directorId: string, @Param('movieId') movieId: string): Promise<void> {
        await this.directorMovieService.delete(directorId, movieId);
    }*/

}
