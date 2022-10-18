import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';
import { ActorMovieService } from './actor-movie.service';
import { faker } from '@faker-js/faker';

describe('ActorMovieService', () => {
  let service: ActorMovieService;
  let actorRepository: Repository<ActorEntity>;
  let movieRepository: Repository<MovieEntity>;
  let actor: ActorEntity;
  let moviesList: MovieEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActorMovieService],
    }).compile();

    service = module.get<ActorMovieService>(ActorMovieService);
    actorRepository = module.get<Repository<ActorEntity>>(getRepositoryToken(ActorEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    actorRepository.clear();
    movieRepository.clear();
    moviesList = [];
    for (let i = 0; i < 5; i++) {
      const movie: MovieEntity = await movieRepository.save({
        title: faker.name.firstName(),
        poster: faker.image.imageUrl(),
        duration: faker.datatype.number(),
        country: faker.address.country(),
        releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
        popularity: faker.datatype.number(),
      });
      moviesList.push(movie);
    }

    actor = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence(),
      movies: moviesList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMovieToActor should return a actor with the movie added', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedActor = await service.addMovieToActor(actor.id, movie.id);
    expect(updatedActor.movies.length).toEqual(moviesList.length + 1);
  });

  it('addMovieToActor should throw an exception for an invalid actor', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.addMovieToActor("0", movie.id)).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('addMovieToActor should throw an exception for an invalid movie', async () => {
    await expect(service.addMovieToActor(actor.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMoviesFromActor should return a list of movies from a actor', async () => {
    const movies = await service.findMoviesFromActor(actor.id);
    expect(movies.length).toEqual(moviesList.length);
  });

  it('findMoviesFromActor should throw an exception for an invalid actor', async () => {
    await expect(service.findMoviesFromActor("0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('findMovieFromActor should return a movie from a actor', async () => {
    const movie = moviesList[0];
    const storedMovie = await service.findMovieFromActor(actor.id, movie.id);
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });

  it('findMovieFromActor should throw an exception for an invalid actor', async () => {
    const movie = moviesList[0];
    await expect(service.findMovieFromActor("0", movie.id)).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('findMovieFromActor should throw an exception for an invalid movie', async () => {
    await expect(service.findMovieFromActor(actor.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMovieFromActor should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.findMovieFromActor(actor.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the actor");
  });

  it('updateMoviesFromActor should return a actor with the movies updated', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedActor = await service.updateMoviesFromActor(actor.id, [movie]);
    expect(updatedActor.movies.length).toEqual(1);
    expect(updatedActor.movies[0].title).toEqual(movie.title);
    expect(updatedActor.movies[0].poster).toEqual(movie.poster);
    expect(updatedActor.movies[0].duration).toEqual(movie.duration);
    expect(updatedActor.movies[0].country).toEqual(movie.country);
    expect(updatedActor.movies[0].releaseDate).toEqual(movie.releaseDate);
    expect(updatedActor.movies[0].popularity).toEqual(movie.popularity);
  });

  it('updateMoviesFromActor should throw an exception for an invalid actor', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromActor("0", [movie])).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('updateMoviesFromActor should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromActor(actor.id, [movie, { id: "0" } as MovieEntity])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromActor should delete a movie from a actor', async () => {
    const movie = moviesList[0];

    await service.deleteMovieFromActor(actor.id, movie.id);

    const storedActor: ActorEntity = await actorRepository.findOne({ where: { id: actor.id }, relations: ['movies'] });
    const deletedMovie = storedActor.movies.find(m => m.id === movie.id);

    expect(deletedMovie).toBeUndefined();
  });

  it('deleteMovieFromActor should throw an exception for an invalid actor', async () => {
    const movie = moviesList[0];
    await expect(service.deleteMovieFromActor("0", movie.id)).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('deleteMovieFromActor should throw an exception for an invalid movie', async () => {
    await expect(service.deleteMovieFromActor(actor.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromActor should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.deleteMovieFromActor(actor.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the actor");
  });

});