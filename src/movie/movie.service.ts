import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { GenreEntity } from '../genre/genre.entity';
import { DirectorEntity } from '../director/director.entity';
import { YoutubeTrailerEntity } from '../youtube-trailer/youtube-trailer.entity';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
        @InjectRepository(YoutubeTrailerEntity)
        private readonly youtubeTrailerRepository: Repository<YoutubeTrailerEntity>,
    ) { }

    async findAll(): Promise<MovieEntity[]> {
        return await this.movieRepository.find({ relations: ['director', 'actors', 'genre', 'platforms', 'reviews', 'youtubeTrailer'] });
    }

    async findOne(id: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id }, relations: ['director', 'actors', 'genre', 'platforms', 'reviews', 'youtubeTrailer'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        return movie;
    }

    async create(movie: MovieEntity): Promise<MovieEntity> {
        if (movie.genre == null)
            throw new BusinessLogicException("The movie must have a genre", BusinessError.PRECONDITION_FAILED);

        if (movie.director == null)
            throw new BusinessLogicException("The movie must have a director", BusinessError.PRECONDITION_FAILED);

        if (movie.youtubeTrailer == null)
            throw new BusinessLogicException("The movie must have a youtube trailer", BusinessError.PRECONDITION_FAILED);

        const genre: GenreEntity = await this.movieRepository.manager.getRepository(GenreEntity).findOne({ where: { id: movie.genre.id } });
        if (!genre)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);

        const director: DirectorEntity = await this.movieRepository.manager.getRepository(DirectorEntity).findOne({ where: { id: movie.director.id } });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        const youtubeTrailer: YoutubeTrailerEntity = await this.youtubeTrailerRepository.findOne({ where: { id: movie.youtubeTrailer.id } });
        if (!youtubeTrailer)
            throw new BusinessLogicException("The youtube trailer with the given id was not found", BusinessError.NOT_FOUND);

        movie.genre = genre;
        movie.director = director;
        movie.youtubeTrailer = youtubeTrailer;
        return await this.movieRepository.save(movie);
    }

    async update(id: string, movie: MovieEntity): Promise<MovieEntity> {
        const movieToUpdate: MovieEntity = await this.movieRepository.findOne({ where: { id } });
        if (!movieToUpdate)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        if (movie.genre == null)
            throw new BusinessLogicException("The movie must have a genre", BusinessError.PRECONDITION_FAILED);

        if (movie.director == null)
            throw new BusinessLogicException("The movie must have a director", BusinessError.PRECONDITION_FAILED);

        if (movie.youtubeTrailer == null)
            throw new BusinessLogicException("The movie must have a youtube trailer", BusinessError.PRECONDITION_FAILED);

        const genre: GenreEntity = await this.movieRepository.manager.getRepository(GenreEntity).findOne({ where: { id: movie.genre.id } });
        if (!genre)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);

        const director: DirectorEntity = await this.movieRepository.manager.getRepository(DirectorEntity).findOne({ where: { id: movie.director.id } });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        const youtubeTrailer: YoutubeTrailerEntity = await this.youtubeTrailerRepository.findOne({ where: { id: movie.youtubeTrailer.id } });
        if (!youtubeTrailer)
            throw new BusinessLogicException("The youtube trailer with the given id was not found", BusinessError.NOT_FOUND);

        movieToUpdate.genre = movie.genre;
        movieToUpdate.director = movie.director;
        movieToUpdate.youtubeTrailer = youtubeTrailer;
        return await this.movieRepository.save({ ...movieToUpdate, ...movie });
    }

    async delete(id: string): Promise<void> {
        const movieToDelete: MovieEntity = await this.movieRepository.findOne({ where: { id } });
        if (!movieToDelete)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        await this.movieRepository.remove(movieToDelete);
    }
}
