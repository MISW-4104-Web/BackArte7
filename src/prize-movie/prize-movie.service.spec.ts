import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrizeEntity } from '../prize/prize.entity';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeMovieService } from './prize-movie.service';
import { faker } from '@faker-js/faker';

describe('PrizeMovieService', () => {
  let service: PrizeMovieService;
  let prizeRepository: Repository<PrizeEntity>;
  let movieRepository: Repository<MovieEntity>;
  let prize: PrizeEntity;
  let moviesList: MovieEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrizeMovieService],
    }).compile();

    service = module.get<PrizeMovieService>(PrizeMovieService);
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    prizeRepository.clear();
    movieRepository.clear();
    moviesList = [];
    for (let i = 0; i < 5; i++) {
      const movie: MovieEntity = await movieRepository.save({
        title: faker.lorem.word(),
        poster: faker.image.imageUrl(),
        duration: faker.datatype.number(),
        country: faker.address.country(),
        releaseDate: faker.date.past(),
        popularity: faker.datatype.number(),
      });
      moviesList.push(movie);
    }

    prize = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
      movies: moviesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMovieToPrize should return a prize with the movie added', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    const updatedPrize = await service.addMovieToPrize(prize.id, movie.id);
    expect(updatedPrize.movies.length).toEqual(moviesList.length + 1);
  });

  it('addMovieToPrize should throw an exception for an invalid prize', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    await expect(service.addMovieToPrize('0', movie.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('addMovieToPrize should throw an exception for an invalid movie', async () => {
    await expect(service.addMovieToPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('findMoviesFromPrize should return a list of movies from a prize', async () => {
    const movies = await service.findMoviesFromPrize(prize.id);
    expect(movies.length).toEqual(moviesList.length);
  });

  it('findMoviesFromPrize should throw an exception for an invalid prize', async () => {
    await expect(service.findMoviesFromPrize('0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findMovieFromPrize should return a movie from a prize', async () => {
    const movie = moviesList[0];
    const storedMovie = await service.findMovieFromPrize(prize.id, movie.id);
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
  });

  it('findMovieFromPrize should throw an exception for an invalid prize', async () => {
    const movie = moviesList[0];
    await expect(service.findMovieFromPrize('0', movie.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findMovieFromPrize should throw an exception for an invalid movie', async () => {
    await expect(service.findMovieFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('findMovieFromPrize should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    await expect(service.findMovieFromPrize(prize.id, movie.id)).rejects.toHaveProperty('message', 'The movie with the given id is not associated to the prize');
  });

  it('updateMoviesFromPrize should return a prize with the movies updated', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    const updatedPrize = await service.updateMoviesFromPrize(prize.id, [movie]);
    expect(updatedPrize.movies.length).toEqual(1);
    expect(updatedPrize.movies[0].title).toEqual(movie.title);
  });

  it('updateMoviesFromPrize should throw an exception for an invalid prize', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromPrize('0', [movie])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('updateMoviesFromPrize should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromPrize(prize.id, [movie, { id: '0' } as MovieEntity])).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('deleteMovieFromPrize should delete a movie from a prize', async () => {
    const movie = moviesList[0];

    await service.deleteMovieFromPrize(prize.id, movie.id);

    const storedPrize: PrizeEntity = await prizeRepository.findOne({ where: { id: prize.id }, relations: ['movies'] });
    const deletedMovie = storedPrize.movies.find(m => m.id === movie.id);

    expect(deletedMovie).toBeUndefined();
  });

  it('deleteMovieFromPrize should throw an exception for an invalid prize', async () => {
    const movie = moviesList[0];
    await expect(service.deleteMovieFromPrize('0', movie.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deleteMovieFromPrize should throw an exception for an invalid movie', async () => {
    await expect(service.deleteMovieFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('deleteMovieFromPrize should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
    });

    await expect(service.deleteMovieFromPrize(prize.id, movie.id)).rejects.toHaveProperty('message', 'The movie with the given id is not associated to the prize');
  });
});
