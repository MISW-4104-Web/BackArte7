import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from '../movie/movie.dto';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';
import { ActorMovieService } from './actor-movie.service';

@Controller('actors/:actorId/movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActorMovieController {
    constructor(private readonly actorMovieService: ActorMovieService) { }

    @Get()
    async findMoviesFromActor(@Param('actorId') actorId: string): Promise<MovieEntity[]> {
        return await this.actorMovieService.findMoviesFromActor(actorId);
    }

    @Get(':movieId')
    async findOne(@Param('actorId') actorId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.actorMovieService.findMovieFromActor(actorId, movieId);
    }

    @Post(':movieId')
    async addMovieToActor(@Param('actorId') actorId: string, @Param('movieId') movieId: string): Promise<ActorEntity> {
        return await this.actorMovieService.addMovieToActor(actorId, movieId);
    }

    @Put()
    async updateMoviesFromActor(@Param('actorId') actorId: string, @Body() moviesDto: MovieDto[]): Promise<ActorEntity> {
        return await this.actorMovieService.updateMoviesFromActor(actorId, plainToInstance(MovieEntity, moviesDto));
    }

    @Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('actorId') actorId: string, @Param('movieId') movieId: string): Promise<void> {
        await this.actorMovieService.deleteMovieFromActor(actorId, movieId);
    }

}