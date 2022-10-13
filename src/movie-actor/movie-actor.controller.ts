import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActorDto } from '../actor/actor.dto';
import { ActorEntity } from '../actor/actor.entity';
import { MovieEntity } from '../movie/movie.entity';
import { MovieActorService } from './movie-actor.service';

@Controller('movies/:movieId/actors')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovieActorController {
    constructor(private readonly movieActorService: MovieActorService) { }

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