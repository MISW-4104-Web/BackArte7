import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { MovieEntity } from '../movie/movie.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
    ) { }

    async findAll(movieId: string): Promise<ReviewEntity[]> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['reviews'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        return movie.reviews;
    }

    async findOne(movieId: string, reviewId: string): Promise<ReviewEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['reviews'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedReview: ReviewEntity = await this.reviewRepository.findOne({ where: { id: reviewId } });
        if (!persistedReview)
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        const review: ReviewEntity = movie.reviews.find(r => r.id === reviewId);
        if (!review)
            throw new BusinessLogicException("The review with the given id is not associated to the movie", BusinessError.NOT_FOUND);
        return review;
    }

    async create(movieId: string, review: ReviewEntity): Promise<ReviewEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        review.movie = movie;
        if (review.score > 5 || review.score < 0)
            throw new BusinessLogicException("The score must be between 0 and 5", BusinessError.BAD_REQUEST);

        return await this.reviewRepository.save(review);
    }

    async update(movieId: string, reviewId: string, review: ReviewEntity): Promise<ReviewEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['reviews'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedReview: ReviewEntity = await this.reviewRepository.findOne({ where: { id: reviewId } });
        if (!persistedReview)
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        const reviewToUpdate: ReviewEntity = movie.reviews.find(r => r.id === reviewId);
        if (!reviewToUpdate)
            throw new BusinessLogicException("The review with the given id is not associated to the movie", BusinessError.NOT_FOUND);
        if (review.score > 5 || review.score < 0)
            throw new BusinessLogicException("The score must be between 0 and 5", BusinessError.BAD_REQUEST);

        return await this.reviewRepository.save({ ...reviewToUpdate, ...review });
    }

    async delete(movieId: string, reviewId: string): Promise<void> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['reviews'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedReview: ReviewEntity = await this.reviewRepository.findOne({ where: { id: reviewId }, relations: ['movie'] });
        if (!persistedReview)
            throw new BusinessLogicException("The review with the given id was not found", BusinessError.NOT_FOUND);
        const reviewToDelete: ReviewEntity = movie.reviews.find(r => r.id === reviewId);
        if (!reviewToDelete)
            throw new BusinessLogicException("The review with the given id is not associated to the movie", BusinessError.NOT_FOUND);
        await this.reviewRepository.remove(reviewToDelete);
    }
}
