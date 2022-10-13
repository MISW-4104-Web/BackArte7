import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { DirectorEntity } from '../director/director.entity';
import { DirectorMovieService } from './director-movie.service';
import { faker } from '@faker-js/faker';

describe('DirectorMovieService', () => {
  let service: DirectorMovieService;
  let directorRepository: Repository<DirectorEntity>;
  let movieRepository: Repository<MovieEntity>;
  let director: DirectorEntity;
  let moviesList: MovieEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DirectorMovieService],
    }).compile();

    service = module.get<DirectorMovieService>(DirectorMovieService);
    directorRepository = module.get<Repository<DirectorEntity>>(getRepositoryToken(DirectorEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    directorRepository.clear();
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
    
    director = await directorRepository.save({
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

  it('addMovieToDirector should return the movie added', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const addedMovie = await service.addMovieToDirector(director.id, movie.id);
    expect(addedMovie).not.toBeNull();
    expect(addedMovie.director.id).toEqual(director.id);
    expect(addedMovie.director.name).toEqual(director.name);
    expect(addedMovie.director.photo).toEqual(director.photo);
    expect(addedMovie.director.nationality).toEqual(director.nationality);
    expect(addedMovie.director.birthDate).toEqual(director.birthDate);
    expect(addedMovie.director.biography).toEqual(director.biography);
  });

  it('addMovieToDirector should throw an exception for an invalid director', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.addMovieToDirector("0", movie.id)).rejects.toHaveProperty("message", "The director with the given id was not found");  
  });

  it('addMovieToDirector should throw an exception for an invalid movie', async () => {
    await expect(service.addMovieToDirector(director.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMoviesFromDirector should return a list of movies from a director', async () => {
    const movies = await service.findMoviesFromDirector(director.id);
    expect(movies.length).toEqual(moviesList.length);
  });

  it('findMoviesFromDirector should throw an exception for an invalid director', async () => {
    await expect(service.findMoviesFromDirector("0")).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('findMovieFromDirector should return a movie from a director', async () => {
    const movie = moviesList[0];
    const storedMovie = await service.findMovieFromDirector(director.id, movie.id);
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });

  it('findMovieFromDirector should throw an exception for an invalid director', async () => {
    const movie = moviesList[0];
    await expect(service.findMovieFromDirector("0", movie.id)).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('findMovieFromDirector should throw an exception for an invalid movie', async () => {
    await expect(service.findMovieFromDirector(director.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findMovieFromDirector should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.findMovieFromDirector(director.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the director");
  });

  it('updateMoviesFromDirector should return the list of movies updated', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    const updatedMovies = await service.updateMoviesFromDirector(director.id, [movie]);
    expect(updatedMovies.length).toEqual(1);
    expect(updatedMovies[0].title).toEqual(movie.title);
    expect(updatedMovies[0].poster).toEqual(movie.poster);
    expect(updatedMovies[0].duration).toEqual(movie.duration);
    expect(updatedMovies[0].country).toEqual(movie.country);
    expect(updatedMovies[0].releaseDate).toEqual(movie.releaseDate);
    expect(updatedMovies[0].popularity).toEqual(movie.popularity);
  });

  it('updateMoviesFromDirector should throw an exception for an invalid director', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromDirector("0", [movie])).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('updateMoviesFromDirector should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.updateMoviesFromDirector(director.id, [movie, { id: "0" } as MovieEntity])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  /*it('deleteMovieFromDirector should delete a movie from a director', async () => {
    const movie = moviesList[0];

    await service.deleteMovieFromDirector(director.id, movie.id);

    const storedDirector: DirectorEntity = await directorRepository.findOne({where: {id: director.id}, relations: ['movies'] });
    const deletedMovie = storedDirector.movies.find(m => m.id === movie.id);

    expect(deletedMovie).toBeUndefined();
  });

  it('deleteMovieFromDirector should throw an exception for an invalid director', async () => {
    const movie = moviesList[0];
    await expect(service.deleteMovieFromDirector("0", movie.id)).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('deleteMovieFromDirector should throw an exception for an invalid movie', async () => {
    await expect(service.deleteMovieFromDirector(director.id, "0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteMovieFromDirector should throw an exception for a non associated movie', async () => {
    const movie: MovieEntity = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });

    await expect(service.deleteMovieFromDirector(director.id, movie.id)).rejects.toHaveProperty("message", "The movie with the given id is not associated to the director");
  });*/

});
