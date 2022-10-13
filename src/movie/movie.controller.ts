/**
 * import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActorDto } from './actor.dto';
import { ActorEntity } from './actor.entity';
import { ActorService } from './actor.service';

@Controller('actors')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

    @Get()
    async findAll(): Promise<ActorEntity[]> {
        return await this.actorService.findAll();
    }

    @Get(':actorId')
    async findOne(@Param('actorId') actorId: string): Promise<ActorEntity> {
        return await this.actorService.findOne(actorId);
    }

    @Post()
    async create(@Body() actorDto: ActorDto): Promise<ActorEntity> {
        return await this.actorService.create(plainToInstance(ActorEntity, actorDto));
    }

    @Put(':actorId')
    async update(@Param('actorId') actorId: string, @Body() actorDto: ActorDto): Promise<ActorEntity> {
        return await this.actorService.update(actorId, plainToInstance(ActorEntity, actorDto));
    }

    @Delete(':actorId')
    @HttpCode(204)
    async delete(@Param('actorId') actorId: string): Promise<void> {
        await this.actorService.delete(actorId);
    }
    
}

 */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from './movie.dto';
import { MovieEntity } from './movie.entity';
import { MovieService } from './movie.service';

@Controller('movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    async findAll(): Promise<MovieEntity[]> {
        return await this.movieService.findAll();
    }

    @Get(':movieId')
    async findOne(@Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.movieService.findOne(movieId);
    }

    @Post()
    async create(@Body() movieDto: MovieDto): Promise<MovieEntity> {
        return await this.movieService.create(plainToInstance(MovieEntity, movieDto));
    }

    @Put(':movieId')
    async update(@Param('movieId') movieId: string, @Body() movieDto: MovieDto): Promise<MovieEntity> {
        return await this.movieService.update(movieId, plainToInstance(MovieEntity, movieDto));
    }

    @Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('movieId') movieId: string): Promise<void> {
        await this.movieService.delete(movieId);
    }
    
}
