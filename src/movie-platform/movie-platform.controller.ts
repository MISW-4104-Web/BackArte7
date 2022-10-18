import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PlatformDto } from '../platform/platform.dto';
import { PlatformEntity } from '../platform/platform.entity';
import { MovieEntity } from '../movie/movie.entity';
import { MoviePlatformService } from './movie-platform.service';

@Controller('movies/:movieId/platforms')
@UseInterceptors(BusinessErrorsInterceptor)
export class MoviePlatformController {
    constructor(private readonly moviePlatformService: MoviePlatformService) { }

    @Get()
    async findPlatformsFromMovie(@Param('movieId') movieId: string): Promise<PlatformEntity[]> {
        return await this.moviePlatformService.findPlatformsFromMovie(movieId);
    }

    @Get(':platformId')
    async findOne(@Param('movieId') movieId: string, @Param('platformId') platformId: string): Promise<PlatformEntity> {
        return await this.moviePlatformService.findPlatformFromMovie(movieId, platformId);
    }

    @Post(':platformId')
    async addPlatformToMovie(@Param('movieId') movieId: string, @Param('platformId') platformId: string): Promise<MovieEntity> {
        return await this.moviePlatformService.addPlatformToMovie(movieId, platformId);
    }

    @Put()
    async updatePlatformsFromMovie(@Param('movieId') movieId: string, @Body() platformsDto: PlatformDto[]): Promise<MovieEntity> {
        return await this.moviePlatformService.updatePlatformsFromMovie(movieId, plainToInstance(PlatformEntity, platformsDto));
    }

    @Delete(':platformId')
    @HttpCode(204)
    async delete(@Param('movieId') movieId: string, @Param('platformId') platformId: string): Promise<void> {
        await this.moviePlatformService.deletePlatformFromMovie(movieId, platformId);
    }

}