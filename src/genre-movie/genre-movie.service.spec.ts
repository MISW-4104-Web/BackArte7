import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { GenreEntity } from '../genre/genre.entity';
import { GenreMovieService } from './genre-movie.service';
import { faker } from '@faker-js/faker';

describe('GenreMovieService', () => {
  let service: GenreMovieService;
  let genreRepository: Repository<GenreEntity>;
  let movieRepository: Repository<MovieEntity>;
  let genre: GenreEntity;
  let moviesList: MovieEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GenreMovieService],
    }).compile();

    service = module.get<GenreMovieService>(GenreMovieService);
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    genreRepository.clear();
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

    genre = await genreRepository.save({
      type: faker.name.firstName(),
      movies: moviesList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  }); 

  it('addMovieToGenre should return the movie added', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const addedMovie = await service.addMovieToGenre(genre.id, movie.id);
    expect(addedMovie).not.toBeNull();
    expect(addedMovie.genre.id).toEqual(genre.id);
    expect(addedMovie.genre.type).toEqual(genre.type);
  });

  it('addMovieToGenre should throw an exception for an invalid genre', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.addMovieToGenre("0", movie.id)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('addMovieToGenre should throw an exception for an invalid movie', async () => {
    await expect(service.addMovieToGenre(genre.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMoviesFromGenre should return a list of movies from a genre', async () => {
    const movies = await service.findMoviesFromGenre(genre.id);
    expect(movies.length).toEqual(moviesList.length);
  });

  it('findMoviesFromGenre should throw an exception for an invalid genre', async () => {
    await expect(service.findMoviesFromGenre("0")).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('findMovieFromGenre should return a movie from a genre', async () => {
    const movie = moviesList[0];
    const storedMovie = await service.findMovieFromGenre(genre.id, movie.id);
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });

  it('findMovieFromGenre should throw an exception for an invalid genre', async () => {
    const movie = moviesList[0];
    await expect(service.findMovieFromGenre("0", movie.id)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('findMovieFromGenre should throw an exception for an invalid movie', async () => {
    await expect(service.findMovieFromGenre(genre.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMovieFromGenre should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.findMovieFromGenre(genre.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the genre");
  });

  it('updateMoviesFromGenre should return a genre with the movies updated', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedMovies = await service.updateMoviesFromGenre(genre.id, [movie]);
    expect(updatedMovies.length).toEqual(1);
    expect(updatedMovies[0].title).toEqual(movie.title);
    expect(updatedMovies[0].poster).toEqual(movie.poster);
    expect(updatedMovies[0].duration).toEqual(movie.duration);
    expect(updatedMovies[0].country).toEqual(movie.country);
    expect(updatedMovies[0].releaseDate).toEqual(movie.releaseDate);
    expect(updatedMovies[0].popularity).toEqual(movie.popularity);
  });

  it('updateMoviesFromGenre should throw an exception for an invalid genre', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromGenre("0", [movie])).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('updateMoviesFromGenre should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromGenre(genre.id, [movie, { id: "0" } as MovieEntity])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  /*it('deleteMovieFromGenre should delete a movie from a genre', async () => {
    const movie = moviesList[0];

    await service.deleteMovieFromGenre(genre.id, movie.id);

    const storedGenre: GenreEntity = await genreRepository.findOne({where: {id: genre.id}, relations: ['movies'] });
    const deletedMovie = storedGenre.movies.find(m => m.id === movie.id);

    expect(deletedMovie).toBeUndefined();
  });

  it('deleteMovieFromGenre should throw an exception for an invalid genre', async () => {
    const movie = moviesList[0];
    await expect(service.deleteMovieFromGenre("0", movie.id)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('deleteMovieFromGenre should throw an exception for an invalid movie', async () => {
    await expect(service.deleteMovieFromGenre(genre.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromGenre should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.deleteMovieFromGenre(genre.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the genre");
  });*/

});
