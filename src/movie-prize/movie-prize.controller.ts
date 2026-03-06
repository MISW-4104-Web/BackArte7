import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrizeDto } from '../prize/prize.dto';
import { PrizeEntity } from '../prize/prize.entity';
import { MovieEntity } from '../movie/movie.entity';
import { MoviePrizeService } from './movie-prize.service';

@Controller('movies/:movieId/prizes')
@UseInterceptors(BusinessErrorsInterceptor)
export class MoviePrizeController {
    constructor(private readonly moviePrizeService: MoviePrizeService) { }

    @Get()
    async findPrizesFromMovie(@Param('movieId') movieId: string): Promise<PrizeEntity[]> {
        return await this.moviePrizeService.findPrizesFromMovie(movieId);
    }

    @Get(':prizeId')
    async findOne(@Param('movieId') movieId: string, @Param('prizeId') prizeId: string): Promise<PrizeEntity> {
        return await this.moviePrizeService.findPrizeFromMovie(movieId, prizeId);
    }

    @Post(':prizeId')
    async addPrizeToMovie(@Param('movieId') movieId: string, @Param('prizeId') prizeId: string): Promise<MovieEntity> {
        return await this.moviePrizeService.addPrizeToMovie(movieId, prizeId);
    }

    @Put()
    async updatePrizesFromMovie(@Param('movieId') movieId: string, @Body() prizesDto: PrizeDto[]): Promise<MovieEntity> {
        return await this.moviePrizeService.updatePrizesFromMovie(movieId, plainToInstance(PrizeEntity, prizesDto));
    }

    @Delete(':prizeId')
    @HttpCode(204)
    async delete(@Param('movieId') movieId: string, @Param('prizeId') prizeId: string): Promise<void> {
        await this.moviePrizeService.deletePrizeFromMovie(movieId, prizeId);
    }
}
