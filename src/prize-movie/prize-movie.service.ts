import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PrizeEntity } from '../prize/prize.entity';
import { MovieEntity } from '../movie/movie.entity';

@Injectable()
export class PrizeMovieService {
    constructor(
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
    ) { }

    async addMovieToPrize(prizeId: string, movieId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['movies'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        prize.movies = [...prize.movies, movie];
        return await this.prizeRepository.save(prize);
    }

    async findMoviesFromPrize(prizeId: string): Promise<MovieEntity[]> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['movies'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        return prize.movies;
    }

    async findMovieFromPrize(prizeId: string, movieId: string): Promise<MovieEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['movies'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = prize.movies.find(movie => movie.id === movieId);
        if (!movie)
            throw new BusinessLogicException("The movie with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        return movie;
    }

    async updateMoviesFromPrize(prizeId: string, movies: MovieEntity[]): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['movies'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        for (const movie of movies) {
            const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movie.id } });
            if (!persistedMovie)
                throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        }

        prize.movies = movies;
        return await this.prizeRepository.save(prize);
    }

    async deleteMovieFromPrize(prizeId: string, movieId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['movies'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movieIndex: number = prize.movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1)
            throw new BusinessLogicException("The movie with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        prize.movies.splice(movieIndex, 1);
        return await this.prizeRepository.save(prize);
    }
}
