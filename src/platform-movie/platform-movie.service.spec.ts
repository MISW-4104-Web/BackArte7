import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformEntity } from '../platform/platform.entity';
import { PlatformMovieService } from './platform-movie.service';
import { faker } from '@faker-js/faker';

describe('PlatformMovieService', () => {
  let service: PlatformMovieService;
  let platformRepository: Repository<PlatformEntity>;
  let movieRepository: Repository<MovieEntity>;
  let platform: PlatformEntity;
  let moviesList: MovieEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlatformMovieService],
    }).compile();

    service = module.get<PlatformMovieService>(PlatformMovieService);
    platformRepository = module.get<Repository<PlatformEntity>>(getRepositoryToken(PlatformEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    platformRepository.clear();
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

    platform = await platformRepository.save({
      name: faker.name.firstName(),
      url: faker.internet.url(),
      movies: moviesList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMovieToPlatform should return a platform with the movie added', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedPlatform = await service.addMovieToPlatform(platform.id, movie.id);
    expect(updatedPlatform.movies.length).toEqual(moviesList.length + 1);
  });

  it('addMovieToPlatform should throw an exception for an invalid platform', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.addMovieToPlatform("0", movie.id)).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('addMovieToPlatform should throw an exception for an invalid movie', async () => {
    await expect(service.addMovieToPlatform(platform.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMoviesFromPlatform should return a list of movies from a platform', async () => {
    const movies = await service.findMoviesFromPlatform(platform.id);
    expect(movies.length).toEqual(moviesList.length);
  });

  it('findMoviesFromPlatform should throw an exception for an invalid platform', async () => {
    await expect(service.findMoviesFromPlatform("0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('findMovieFromPlatform should return a movie from a platform', async () => {
    const movie = moviesList[0];
    const storedMovie = await service.findMovieFromPlatform(platform.id, movie.id);
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });

  it('findMovieFromPlatform should throw an exception for an invalid platform', async () => {
    const movie = moviesList[0];
    await expect(service.findMovieFromPlatform("0", movie.id)).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('findMovieFromPlatform should throw an exception for an invalid movie', async () => {
    await expect(service.findMovieFromPlatform(platform.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMovieFromPlatform should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.findMovieFromPlatform(platform.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the platform");
  });

  it('updateMoviesFromPlatform should return a platform with the movies updated', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedPlatform = await service.updateMoviesFromPlatform(platform.id, [movie]);
    expect(updatedPlatform.movies.length).toEqual(1);
    expect(updatedPlatform.movies[0].title).toEqual(movie.title);
    expect(updatedPlatform.movies[0].poster).toEqual(movie.poster);
    expect(updatedPlatform.movies[0].duration).toEqual(movie.duration);
    expect(updatedPlatform.movies[0].country).toEqual(movie.country);
    expect(updatedPlatform.movies[0].releaseDate).toEqual(movie.releaseDate);
    expect(updatedPlatform.movies[0].popularity).toEqual(movie.popularity);
  });

  it('updateMoviesFromPlatform should throw an exception for an invalid platform', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromPlatform("0", [movie])).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('updateMoviesFromPlatform should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromPlatform(platform.id, [movie, { id: "0" } as MovieEntity])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromPlatform should delete a movie from a platform', async () => {
    const movie = moviesList[0];

    await service.deleteMovieFromPlatform(platform.id, movie.id);

    const storedPlatform: PlatformEntity = await platformRepository.findOne({ where: { id: platform.id }, relations: ['movies'] });
    const deletedMovie = storedPlatform.movies.find(m => m.id === movie.id);

    expect(deletedMovie).toBeUndefined();
  });

  it('deleteMovieFromPlatform should throw an exception for an invalid platform', async () => {
    const movie = moviesList[0];
    await expect(service.deleteMovieFromPlatform("0", movie.id)).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('deleteMovieFromPlatform should throw an exception for an invalid movie', async () => {
    await expect(service.deleteMovieFromPlatform(platform.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromPlatform should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.deleteMovieFromPlatform(platform.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the platform");
  });

});
