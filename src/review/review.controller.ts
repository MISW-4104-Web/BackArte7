import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ReviewDto } from './review.dto';
import { ReviewEntity } from './review.entity';
import { ReviewService } from './review.service';

@Controller('movies/:movieId/reviews')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get()
    async findAll(@Param('movieId') movieId: string): Promise<ReviewEntity[]> {
        return await this.reviewService.findAll(movieId);
    }

    @Get(':reviewId')
    async findOne(@Param('movieId') movieId: string, @Param('reviewId') reviewId: string): Promise<ReviewEntity> {
        return await this.reviewService.findOne(movieId, reviewId);
    }

    @Post()
    async create(@Param('movieId') movieId: string, @Body() reviewDto: ReviewDto): Promise<ReviewEntity> {
        return await this.reviewService.create(movieId, plainToInstance(ReviewEntity, reviewDto));
    }

    @Put(':reviewId')
    async update(@Param('movieId') movieId: string, @Param('reviewId') reviewId: string, @Body() reviewDto: ReviewDto): Promise<ReviewEntity> {
        return await this.reviewService.update(movieId, reviewId, plainToInstance(ReviewEntity, reviewDto));
    }

    @Delete(':reviewId')
    @HttpCode(204)
    async delete(@Param('movieId') movieId: string, @Param('reviewId') reviewId: string): Promise<void> {
        await this.reviewService.delete(movieId, reviewId);
    }

}