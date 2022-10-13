import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DirectorEntity } from '../director/director.entity';
import { MovieEntity } from '../movie/movie.entity';

@Injectable()
export class DirectorMovieService {
    constructor(
        @InjectRepository(DirectorEntity)
        private readonly directorRepository: Repository<DirectorEntity>,
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
    ) {}

    async addMovieToDirector(directorId: string, movieId: string): Promise<MovieEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        movie.director = director;
        return await this.movieRepository.save(movie);
    }

    async findMoviesFromDirector(directorId: string): Promise<MovieEntity[]> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        return director.movies;
    }

    async findMovieFromDirector(directorId: string, movieId: string): Promise<MovieEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = director.movies.find(movie => movie.id === movieId);
        if (!movie)
            throw new BusinessLogicException("The movie with the given id is not associated to the director", BusinessError.PRECONDITION_FAILED);

        return movie;
    }

    async updateMoviesFromDirector(directorId: string, movies: MovieEntity[]): Promise<MovieEntity[]> {
        const updatedMovies: MovieEntity[] = [];

        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        for (const movie of movies) {
            const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movie.id } });
            if (!persistedMovie)
                throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
            persistedMovie.director = movie.director;
            updatedMovies.push(await this.movieRepository.save(persistedMovie));
        }

        return updatedMovies;
    }

    /*async deleteMovieFromDirector(directorId: string, movieId: string): Promise<void> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movieIndex: number = director.movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1)
            throw new BusinessLogicException("The movie with the given id is not associated to the director", BusinessError.PRECONDITION_FAILED);
        
        director.movies.splice(movieIndex, 1);
        await this.directorRepository.save(director);
    }*/
}   
