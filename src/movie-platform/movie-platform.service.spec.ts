import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformEntity } from '../platform/platform.entity';
import { MoviePlatformService } from './movie-platform.service';
import { faker } from '@faker-js/faker';

describe('MoviePlatformService', () => {
  let service: MoviePlatformService;
  let movieRepository: Repository<MovieEntity>;
  let platformRepository: Repository<PlatformEntity>;
  let movie: MovieEntity;
  let platformsList: PlatformEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MoviePlatformService],
    }).compile();

    service = module.get<MoviePlatformService>(MoviePlatformService);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    platformRepository = module.get<Repository<PlatformEntity>>(getRepositoryToken(PlatformEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {
    movieRepository.clear();
    platformRepository.clear();
    platformsList = [];
    for (let i = 0; i < 5; i++) {
      const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
      });
      platformsList.push(platform);
    }

    movie = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      platforms: platformsList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPlatformToMovie should return a movie with the platform added', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    const updatedMovie = await service.addPlatformToMovie(movie.id, platform.id);
    expect(updatedMovie.platforms.length).toEqual(platformsList.length + 1);
  });

  it('addPlatformToMovie should throw an exception for an invalid movie', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    await expect(service.addPlatformToMovie("0", platform.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('addPlatformToMovie should throw an exception for an invalid platform', async () => {
    await expect(service.addPlatformToMovie(movie.id, "0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('findPlatformsFromMovie should return a list of platforms from a movie', async () => {
    const platforms = await service.findPlatformsFromMovie(movie.id);
    expect(platforms.length).toEqual(platformsList.length);
  });

  it('findPlatformsFromMovie should throw an exception for an invalid movie', async () => {
    await expect(service.findPlatformsFromMovie("0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findPlatformFromMovie should return a platform from a movie', async () => {
    const platform = platformsList[0];
    const storedPlatform = await service.findPlatformFromMovie(movie.id, platform.id);
    expect(storedPlatform).not.toBeNull();
    expect(storedPlatform.name).toEqual(platform.name);
    expect(storedPlatform.url).toEqual(platform.url);
  });

  it('findPlatformFromMovie should throw an exception for an invalid movie', async () => {
    const platform = platformsList[0];
    await expect(service.findPlatformFromMovie("0", platform.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findPlatformFromMovie should throw an exception for an invalid platform', async () => {
    await expect(service.findPlatformFromMovie(movie.id, "0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('findPlatformFromMovie should throw an exception for a non associated platform', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    await expect(service.findPlatformFromMovie(movie.id, platform.id)).rejects.toHaveProperty("message", "The platform with the given id is not associated to the movie");
  });

  it('updatePlatformsFromMovie should return a movie with the platforms updated', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    const updatedMovie = await service.updatePlatformsFromMovie(movie.id, [platform]);
    expect(updatedMovie.platforms.length).toEqual(1);
    expect(updatedMovie.platforms[0].name).toEqual(platform.name);
    expect(updatedMovie.platforms[0].url).toEqual(platform.url);
  });

  it('updatePlatformsFromMovie should throw an exception for an invalid movie', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    await expect(service.updatePlatformsFromMovie("0", [platform])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('updatePlatformsFromMovie should throw an exception for an invalid platform', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    await expect(service.updatePlatformsFromMovie(movie.id, [platform, { id: "0" } as PlatformEntity])).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('deletePlatformFromMovie should delete a platform from a movie', async () => {
    const platform = platformsList[0];

    await service.deletePlatformFromMovie(movie.id, platform.id);

    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id }, relations: ['platforms'] });
    const deletedPlatform = storedMovie.platforms.find(a => a.id === platform.id);

    expect(deletedPlatform).toBeUndefined();
  });

  it('deletePlatformFromMovie should throw an exception for an invalid movie', async () => {
    const platform = platformsList[0];
    await expect(service.deletePlatformFromMovie("0", platform.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deletePlatformFromMovie should throw an exception for an invalid platform', async () => {
    await expect(service.deletePlatformFromMovie(movie.id, "0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('deletePlatformFromMovie should throw an exception for a non associated movie', async () => {
    const platform: PlatformEntity = await platformRepository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
    });

    await expect(service.deletePlatformFromMovie(movie.id, platform.id)).rejects.toHaveProperty("message", "The platform with the given id is not associated to the movie");
  });

});
