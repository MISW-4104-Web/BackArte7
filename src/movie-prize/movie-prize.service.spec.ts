import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { MoviePrizeService } from './movie-prize.service';
import { faker } from '@faker-js/faker';

describe('MoviePrizeService', () => {
  let service: MoviePrizeService;
  let movieRepository: Repository<MovieEntity>;
  let prizeRepository: Repository<PrizeEntity>;
  let movie: MovieEntity;
  let prizesList: PrizeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MoviePrizeService],
    }).compile();

    service = module.get<MoviePrizeService>(MoviePrizeService);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    movieRepository.clear();
    prizeRepository.clear();
    prizesList = [];
    for (let i = 0; i < 5; i++) {
      const prize: PrizeEntity = await prizeRepository.save({
        name: faker.lorem.word(),
        category: faker.lorem.word(),
        year: faker.datatype.number({ min: 1900, max: 2025 }),
        status: faker.helpers.arrayElement(['won', 'nominated']),
      });
      prizesList.push(prize);
    }

    movie = await movieRepository.save({
      title: faker.lorem.word(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.past(),
      popularity: faker.datatype.number(),
      prizes: prizesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPrizeToMovie should return a movie with the prize added', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedMovie = await service.addPrizeToMovie(movie.id, prize.id);
    expect(updatedMovie.prizes.length).toEqual(prizesList.length + 1);
  });

  it('addPrizeToMovie should throw an exception for an invalid movie', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.addPrizeToMovie('0', prize.id)).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('addPrizeToMovie should throw an exception for an invalid prize', async () => {
    await expect(service.addPrizeToMovie(movie.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizesFromMovie should return a list of prizes from a movie', async () => {
    const prizes = await service.findPrizesFromMovie(movie.id);
    expect(prizes.length).toEqual(prizesList.length);
  });

  it('findPrizesFromMovie should throw an exception for an invalid movie', async () => {
    await expect(service.findPrizesFromMovie('0')).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('findPrizeFromMovie should return a prize from a movie', async () => {
    const prize = prizesList[0];
    const storedPrize = await service.findPrizeFromMovie(movie.id, prize.id);
    expect(storedPrize).not.toBeNull();
    expect(storedPrize.name).toEqual(prize.name);
  });

  it('findPrizeFromMovie should throw an exception for an invalid movie', async () => {
    const prize = prizesList[0];
    await expect(service.findPrizeFromMovie('0', prize.id)).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('findPrizeFromMovie should throw an exception for an invalid prize', async () => {
    await expect(service.findPrizeFromMovie(movie.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizeFromMovie should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.findPrizeFromMovie(movie.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the movie');
  });

  it('updatePrizesFromMovie should return a movie with the prizes updated', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedMovie = await service.updatePrizesFromMovie(movie.id, [prize]);
    expect(updatedMovie.prizes.length).toEqual(1);
    expect(updatedMovie.prizes[0].name).toEqual(prize.name);
  });

  it('updatePrizesFromMovie should throw an exception for an invalid movie', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromMovie('0', [prize])).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('updatePrizesFromMovie should throw an exception for an invalid prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromMovie(movie.id, [prize, { id: '0' } as PrizeEntity])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromMovie should delete a prize from a movie', async () => {
    const prize = prizesList[0];

    await service.deletePrizeFromMovie(movie.id, prize.id);

    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id }, relations: ['prizes'] });
    const deletedPrize = storedMovie.prizes.find(p => p.id === prize.id);

    expect(deletedPrize).toBeUndefined();
  });

  it('deletePrizeFromMovie should throw an exception for an invalid movie', async () => {
    const prize = prizesList[0];
    await expect(service.deletePrizeFromMovie('0', prize.id)).rejects.toHaveProperty('message', 'The movie with the given id was not found');
  });

  it('deletePrizeFromMovie should throw an exception for an invalid prize', async () => {
    await expect(service.deletePrizeFromMovie(movie.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromMovie should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.deletePrizeFromMovie(movie.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the movie');
  });
});
