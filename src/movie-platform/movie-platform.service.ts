import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformEntity } from '../platform/platform.entity';

@Injectable()
export class MoviePlatformService {
    constructor(
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
        @InjectRepository(PlatformEntity)
        private readonly platformRepository: Repository<PlatformEntity>,
    ) { }

    async findPlatformsFromMovie(movieId: string): Promise<PlatformEntity[]> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['platforms'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        return movie.platforms;
    }

    async findPlatformFromMovie(movieId: string, platformId: string): Promise<PlatformEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['platforms'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPlatform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId } });
        if (!persistedPlatform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        const platform: PlatformEntity = movie.platforms.find(platform => platform.id === platformId);
        if (!platform)
            throw new BusinessLogicException("The platform with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        return platform;
    }

    async addPlatformToMovie(movieId: string, platformId: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['platforms'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId } });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);

        movie.platforms = [...movie.platforms, platform];
        return await this.movieRepository.save(movie);
    }

    async updatePlatformsFromMovie(movieId: string, platforms: PlatformEntity[]): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['platforms'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        for (const platform of platforms) {
            const persistedPlatform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platform.id } });
            if (!persistedPlatform)
                throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        }

        movie.platforms = platforms;
        return await this.movieRepository.save(movie);
    }

    async deletePlatformFromMovie(movieId: string, platformId: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['platforms'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id: platformId } });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        const platformIndex: number = movie.platforms.findIndex(platform => platform.id === platformId);
        if (platformIndex === -1)
            throw new BusinessLogicException("The platform with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        movie.platforms.splice(platformIndex, 1);
        return await this.movieRepository.save(movie);
    }
}