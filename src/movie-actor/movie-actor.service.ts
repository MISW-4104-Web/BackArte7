import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';

@Injectable()
export class MovieActorService {
    constructor(
        @InjectRepository(MovieEntity)
        private readonly movieRepository: Repository<MovieEntity>,
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
    ) { }

    async findActorsFromMovie(movieId: string): Promise<ActorEntity[]> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['actors'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        return movie.actors;
    }

    async findActorFromMovie(movieId: string, actorId: string): Promise<ActorEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['actors'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!persistedActor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const actor: ActorEntity = movie.actors.find(actor => actor.id === actorId);
        if (!actor)
            throw new BusinessLogicException("The actor with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        return actor;
    }

    async addActorToMovie(movieId: string, actorId: string): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['actors'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        movie.actors = [...movie.actors, actor];
        return await this.movieRepository.save(movie);
    }

    async updateActorsFromMovie(movieId: string, actors: ActorEntity[]): Promise<MovieEntity> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['actors'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);

        for (const actor of actors) {
            const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actor.id } });
            if (!persistedActor)
                throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        }

        movie.actors = actors;
        return await this.movieRepository.save(movie);
    }

    async deleteActorFromMovie(movieId: string, actorId: string): Promise<void> {
        const movie: MovieEntity = await this.movieRepository.findOne({ where: { id: movieId }, relations: ['actors'] });
        if (!movie)
            throw new BusinessLogicException("The movie with the given id was not found", BusinessError.NOT_FOUND);
        const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!persistedActor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const actorIndex: number = movie.actors.findIndex(actor => actor.id === actorId);
        if (actorIndex === -1)
            throw new BusinessLogicException("The actor with the given id is not associated to the movie", BusinessError.PRECONDITION_FAILED);

        movie.actors.splice(actorIndex, 1);
        await this.movieRepository.save(movie);
    }
}