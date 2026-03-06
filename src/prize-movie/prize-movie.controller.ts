import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MovieDto } from '../movie/movie.dto';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { PrizeMovieService } from './prize-movie.service';

@Controller('prizes/:prizeId/movies')
@UseInterceptors(BusinessErrorsInterceptor)
export class PrizeMovieController {
    constructor(private readonly prizeMovieService: PrizeMovieService) { }

    @Get()
    async findMoviesFromPrize(@Param('prizeId') prizeId: string): Promise<MovieEntity[]> {
        return await this.prizeMovieService.findMoviesFromPrize(prizeId);
    }

    @Get(':movieId')
    async findOne(@Param('prizeId') prizeId: string, @Param('movieId') movieId: string): Promise<MovieEntity> {
        return await this.prizeMovieService.findMovieFromPrize(prizeId, movieId);
    }

    @Post(':movieId')
    async addMovieToPrize(@Param('prizeId') prizeId: string, @Param('movieId') movieId: string): Promise<PrizeEntity> {
        return await this.prizeMovieService.addMovieToPrize(prizeId, movieId);
    }

    @Put()
    async updateMoviesFromPrize(@Param('prizeId') prizeId: string, @Body() moviesDto: MovieDto[]): Promise<PrizeEntity> {
        return await this.prizeMovieService.updateMoviesFromPrize(prizeId, plainToInstance(MovieEntity, moviesDto));
    }

    @Delete(':movieId')
    @HttpCode(204)
    async delete(@Param('prizeId') prizeId: string, @Param('movieId') movieId: string): Promise<void> {
        await this.prizeMovieService.deleteMovieFromPrize(prizeId, movieId);
    }
}
