import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformEntity } from '../platform/platform.entity';

@Injectable()
export class PlatformMovieService {
    constructor(
        @InjectRepository(PlatformEntity)
        private readonly platformRepository: Repository<PlatformEntity>,
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
    ) { }

    async addMovieToPlatform(platformId: string, movieId: string): Promise<PlatformEntity> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        platform.movies = [...platform.movies, movie];
        return await this.platformRepository.save(platform);
    }

    async findMoviesFromPlatform(platformId: string): Promise<MovieEntity[]> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);

        return platform.movies;
    }

    async findMovieFromPlatform(platformId: string, movieId: string): Promise<MovieEntity> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = platform.movies.find(movie => movie.id === movieId);
        if (!movie)
            throw new BusinessLogicException("The movie with the given id is not associated to the platform", BusinessError.PRECONDITION_FAILED);

        return movie;
    }

    async updateMoviesFromPlatform(platformId: string, movies: MovieEntity[]): Promise<PlatformEntity> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);

        for (const movie of movies) {
            const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movie.id } });
            if (!persistedMovie)
                throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        }

        platform.movies = movies;
        return await this.platformRepository.save(platform);
    }

    async deleteMovieFromPlatform(platformId: string, movieId: string): Promise<PlatformEntity> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movieIndex: number = platform.movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1)
            throw new BusinessLogicException("The movie with the given id is not associated to the platform", BusinessError.PRECONDITION_FAILED);

        platform.movies.splice(movieIndex, 1);
        return await this.platformRepository.save(platform);
    }
}