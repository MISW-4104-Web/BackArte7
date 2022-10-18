import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';

@Injectable()
export class ActorMovieService {
    constructor(
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
    ) { }

    async addMovieToActor(actorId: string, movieId: string): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        actor.movies = [...actor.movies, movie];
        return await this.actorRepository.save(actor);
    }

    async findMoviesFromActor(actorId: string): Promise<MovieEntity[]> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        return actor.movies;
    }

    async findMovieFromActor(actorId: string, movieId: string): Promise<MovieEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movie: MovieEntity = actor.movies.find(movie => movie.id === movieId);
        if (!movie)
            throw new BusinessLogicException("The movie with the given id is not associated to the actor", BusinessError.PRECONDITION_FAILED);

        return movie;
    }

    async updateMoviesFromActor(actorId: string, movies: MovieEntity[]): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        for (const movie of movies) {
            const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movie.id } });
            if (!persistedMovie)
                throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        }

        actor.movies = movies;
        return await this.actorRepository.save(actor);
    }

    async deleteMovieFromActor(actorId: string, movieId: string): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const persistedMovie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId } });
        if (!persistedMovie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const movieIndex: number = actor.movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1)
            throw new BusinessLogicException("The movie with the given id is not associated to the actor", BusinessError.PRECONDITION_FAILED);

        actor.movies.splice(movieIndex, 1);
        return await this.actorRepository.save(actor);
    }
}