import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from './movie.dto';
import { MovieEntity } from './movie.entity';
import { MovieService } from './movie.service';

@Controller('movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

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
