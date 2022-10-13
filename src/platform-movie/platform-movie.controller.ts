/**
 * import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActorDto } from '../actor/actor.dto';
import { ActorEntity } from '../actor/actor.entity';
import { MovieEntity } from '../movie/movie.entity';
import { MovieActorService } from './movie-actor.service';

@Controller('movies/:movieId/actors')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovieActorController {
    constructor(private readonly movieActorService: MovieActorService) {}

    @Get()
    async findActorsFromMovie(@Param('movieId') movieId: string): Promise<ActorEntity[]> {
        return await this.movieActorService.findActorsFromMovie(movieId);
    }

    @Get(':actorId')
    async findOne(@Param('movieId') movieId: string, @Param('actorId') actorId: string): Promise<ActorEntity> {
        return await this.movieActorService.findActorFromMovie(movieId, actorId);
    }

    @Post(':actorId')
    async addActorToMovie(@Param('movieId') movieId: string, @Param('actorId') actorId: string): Promise<MovieEntity> {
        return await this.movieActorService.addActorToMovie(movieId, actorId);
    }

    @Put()
    async updateActorsFromMovie(@Param('movieId') movieId: string, @Body() actorsDto: ActorDto[]): Promise<MovieEntity> {
        return await this.movieActorService.updateActorsFromMovie(movieId, plainToInstance(ActorEntity, actorsDto));
    }

    @Delete(':actorId')
    @HttpCode(204)
    async delete(@Param('movieId') movieId: string, @Param('actorId') actorId: string): Promise<void> {
        await this.movieActorService.deleteActorFromMovie(movieId, actorId);
    }
    
}
 */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from '../movie/movie.dto';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformEntity } from '../platform/platform.entity';
import { PlatformMovieService } from './platform-movie.service';

@Controller('platforms/:platformId/movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatformMovieController {
    constructor(private readonly platformMovieService: PlatformMovieService) { }

    @Get()
    async findMoviesFromPlatform(@Param('platformId') platformId: string): Promise<MovieEntity[]> {
        return await this.platformMovieService.findMoviesFromPlatform(platformId);
    }

    @Get(':movieId')
    async findOne(@Param('platformId') platformId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.platformMovieService.findMovieFromPlatform(platformId, movieId);
    }

    @Post(':movieId')
    async addMovieToPlatform(@Param('platformId') platformId: string, @Param('movieId') movieId: string): Promise<PlatformEntity> {
        return await this.platformMovieService.addMovieToPlatform(platformId, movieId);
    }

    @Put()
    async updateMoviesFromPlatform(@Param('platformId') platformId: string, @Body() moviesDto: MovieDto[]): Promise<PlatformEntity> {
        return await this.platformMovieService.updateMoviesFromPlatform(platformId, plainToInstance(MovieEntity, moviesDto));
    }

    @Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('platformId') platformId: string, @Param('movieId') movieId: string): Promise<void> {
        await this.platformMovieService.deleteMovieFromPlatform(platformId, movieId);
    }

}