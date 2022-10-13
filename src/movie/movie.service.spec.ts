import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from './movie.entity';
import { GenreEntity } from '../genre/genre.entity';
import { DirectorEntity } from '../director/director.entity';
import { YoutubeTrailerEntity } from '../youtube-trailer/youtube-trailer.entity';
import { MovieService } from './movie.service';
import { faker } from '@faker-js/faker';

describe('MovieService', () => {
  let service: MovieService;
  let movieRepository: Repository<MovieEntity>;
  let directorRepository: Repository<DirectorEntity>;
  let genreRepository: Repository<GenreEntity>;
  let youtubeTrailerRepository: Repository<YoutubeTrailerEntity>;
  let moviesList: MovieEntity[] = [];
  let director: DirectorEntity;
  let genre: GenreEntity;
  let youtubeTrailer: YoutubeTrailerEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MovieService],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    directorRepository = module.get<Repository<DirectorEntity>>(getRepositoryToken(DirectorEntity));
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    youtubeTrailerRepository = module.get<Repository<YoutubeTrailerEntity>>(getRepositoryToken(YoutubeTrailerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
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
      biography: faker.lorem.sentence()
    });

    genre = await genreRepository.save({
      type: faker.name.firstName()
    });

    youtubeTrailer = await youtubeTrailerRepository.save({
      name: faker.name.firstName(),
      url: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      channel: faker.name.firstName()
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all movies', async () => {
    const movies: MovieEntity[] = await service.findAll();
    expect(movies).not.toBeNull();
    expect(movies).toHaveLength(moviesList.length);
  });

  it('findOne should return a movie by id', async () => {
    const storedMovie: MovieEntity = moviesList[0];
    const movie: MovieEntity = await service.findOne(storedMovie.id);
    expect(movie).not.toBeNull();
    expect(movie.title).toEqual(storedMovie.title);
    expect(movie.poster).toEqual(storedMovie.poster);
    expect(movie.duration).toEqual(storedMovie.duration);
    expect(movie.country).toEqual(storedMovie.country);
    expect(movie.releaseDate).toEqual(storedMovie.releaseDate);
    expect(movie.popularity).toEqual(storedMovie.popularity);
  });

  it('findOne should throw an exception for an invalid movie', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('create should return a new movie', async () => {
    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director,
      actors: [],
      genre,
      platforms: [],
      reviews: [],
      youtubeTrailer
    };

    const newMovie: MovieEntity = await service.create(movie);
    expect(newMovie).not.toBeNull();

    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: newMovie.id } });
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });


  it('create should throw an exception for a non associated genre', async () => {
    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director,
      actors: [],
      genre: null,
      platforms: [],
      reviews: [],
      youtubeTrailer
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The movie must have a genre");
  });

  it('create should throw an exception for a non associated director', async () => {
    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director: null,
      actors: [],
      genre,
      platforms: [],
      reviews: [],
      youtubeTrailer
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The movie must have a director");
  });

  it('create should throw an exception for a non associated youtube trailer', async () => {
    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director,
      actors: [],
      genre,
      platforms: [],
      reviews: [],
      youtubeTrailer: null
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The movie must have a youtube trailer");
  });

  it('create should throw an exception for an invalid genre', async () => {
    const nonSavedGenre: GenreEntity = {
      id: "",
      type: faker.name.firstName(),
      movies: []
    };

    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director,
      actors: [],
      genre: nonSavedGenre,
      platforms: [],
      reviews: [],
      youtubeTrailer
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('create should throw an exception for an invalid director', async () => {
    const nonSavedDirector: DirectorEntity = {
      id: "",
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence(),
      movies: []
    };

    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director: nonSavedDirector,
      actors: [],
      genre,
      platforms: [],
      reviews: [],
      youtubeTrailer
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('create should throw an exception for an invalid youtube trailer', async () => {
    const nonSavedYoutubeTrailer: YoutubeTrailerEntity = {
      id: "",
      name: faker.name.firstName(),
      url: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      channel: faker.name.firstName(),
      movie: null
    };

    const movie: MovieEntity = {
      id: "",
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      director,
      actors: [],
      genre,
      platforms: [],
      reviews: [],
      youtubeTrailer: nonSavedYoutubeTrailer
    };

    await expect(service.create(movie)).rejects.toHaveProperty("message", "The youtube trailer with the given id was not found");
  });

  it('update should modify a movie', async () => {
    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = genre;
    movie.director = director;
    movie.youtubeTrailer = youtubeTrailer;

    const updatedMovie: MovieEntity = await service.update(movie.id, movie);
    expect(updatedMovie).not.toBeNull();
    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id } });
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.title).toEqual(movie.title);
    expect(storedMovie.poster).toEqual(movie.poster);
    expect(storedMovie.duration).toEqual(movie.duration);
    expect(storedMovie.country).toEqual(movie.country);
    expect(storedMovie.releaseDate).toEqual(movie.releaseDate);
    expect(storedMovie.popularity).toEqual(movie.popularity);
  });

  it('update should throw an exception for an invalid movie', async () => {
    let movie: MovieEntity = moviesList[0];
    movie = {
      ...movie,
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number()
    };
    await expect(() => service.update("0", movie)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('update should throw an exception for a non associated genre', async () => {
    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = null;
    movie.director = director;
    movie.youtubeTrailer = youtubeTrailer;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The movie must have a genre");
  });

  it('update should throw an exception for a non associated director', async () => {
    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = genre;
    movie.director = null;
    movie.youtubeTrailer = youtubeTrailer;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The movie must have a director");
  });

  it('update should throw an exception for a non associated youtube trailer', async () => {
    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = genre;
    movie.director = director;
    movie.youtubeTrailer = null;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The movie must have a youtube trailer");
  });

  it('update should throw an exception for an invalid genre', async () => {
    const nonSavedGenre: GenreEntity = {
      id: "",
      type: faker.name.firstName(),
      movies: []
    };

    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = nonSavedGenre;
    movie.director = director;
    movie.youtubeTrailer = youtubeTrailer;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('update should throw an exception for an invalid director', async () => {
    const nonSavedDirector: DirectorEntity = {
      id: "",
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence(),
      movies: []
    };

    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = genre;
    movie.director = nonSavedDirector;
    movie.youtubeTrailer = youtubeTrailer;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The director with the given id was not found");
  });


  it('update should throw an exception for an invalid youtube trailer', async () => {
    const nonSavedYoutubeTrailer: YoutubeTrailerEntity = {
      id: "",
      name: faker.name.firstName(),
      url: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      channel: faker.name.firstName(),
      movie: null
    };

    const movie: MovieEntity = moviesList[0];
    movie.title = faker.name.firstName();
    movie.poster = faker.image.imageUrl();
    movie.duration = faker.datatype.number();
    movie.country = faker.address.country();
    movie.releaseDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    movie.popularity = faker.datatype.number();
    movie.genre = genre;
    movie.director = director;
    movie.youtubeTrailer = nonSavedYoutubeTrailer;

    await expect(service.update(movie.id, movie)).rejects.toHaveProperty("message", "The youtube trailer with the given id was not found");
  });

  it('delete should remove a movie', async () => {
    const movie: MovieEntity = moviesList[0];
    await service.delete(movie.id);
    const deletedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id } });
    expect(deletedMovie).toBeNull();
  });

  it('delete should throw an exception for an invalid movie', async () => {
    const movie: MovieEntity = moviesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

});
