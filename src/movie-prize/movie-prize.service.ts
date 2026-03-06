import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeEntity } from '../prize/prize.entity';

@Injectable()
export class MoviePrizeService {
    constructor(
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
    ) { }

    async addPrizeToMovie(movieId: string, prizeId: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['prizes'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        movie.prizes = [...movie.prizes, prize];
        return await this.movieRepository.save(movie);
    }

    async findPrizesFromMovie(movieId: string): Promise<PrizeEntity[]> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['prizes'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        return movie.prizes;
    }

    async findPrizeFromMovie(movieId: string, prizeId: string): Promise<PrizeEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['prizes'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = movie.prizes.find(pr => pr.id === prizeId);
        if (!prize)
            throw new BusinessLogicException("The prize with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        return prize;
    }

    async updatePrizesFromMovie(movieId: string, prizes: PrizeEntity[]): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['prizes'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        for (const prize of prizes) {
            const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prize.id } });
            if (!persistedPrize)
                throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        }

        movie.prizes = prizes;
        return await this.movieRepository.save(movie);
    }

    async deletePrizeFromMovie(movieId: string, prizeId: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['prizes'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prizeIndex: number = movie.prizes.findIndex(pr => pr.id === prizeId);
        if (prizeIndex === -1)
            throw new BusinessLogicException("The prize with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        movie.prizes.splice(prizeIndex, 1);
        return await this.movieRepository.save(movie);
    }
}
