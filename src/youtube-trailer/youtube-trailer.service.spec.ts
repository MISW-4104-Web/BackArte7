import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { YoutubeTrailerEntity } from './youtube-trailer.entity';
import { MovieEntity } from '../movie/movie.entity';
import { YoutubeTrailerService } from './youtube-trailer.service';
import { faker } from '@faker-js/faker';

describe('YoutubeTrailerService', () => {
  let service: YoutubeTrailerService;
  let youtubeTrailerRepository: Repository<YoutubeTrailerEntity>;
  let movieRepository: Repository<MovieEntity>;
  let youtubeTrailersList: YoutubeTrailerEntity[] = [];
  let movie: MovieEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [YoutubeTrailerService],
    }).compile();

    service = module.get<YoutubeTrailerService>(YoutubeTrailerService);
    youtubeTrailerRepository = module.get<Repository<YoutubeTrailerEntity>>(getRepositoryToken(YoutubeTrailerEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    youtubeTrailerRepository.clear();
    youtubeTrailersList = [];
    for (let i = 0; i < 5; i++) {
      const youtubeTrailer: YoutubeTrailerEntity = await youtubeTrailerRepository.save({
        name: faker.name.firstName(),
        url: faker.image.imageUrl(),
        duration: faker.datatype.number(),
        channel: faker.name.firstName(),
      });
      youtubeTrailersList.push(youtubeTrailer);
    }

    movie = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all youtube trailers', async () => {
    const youtubeTrailers: YoutubeTrailerEntity[] = await service.findAll();
    expect(youtubeTrailers).not.toBeNull();
    expect(youtubeTrailers).toHaveLength(youtubeTrailersList.length);
  });

  it('findOne should return a youtube trailer', async () => {
    const storedYoutubeTrailer: YoutubeTrailerEntity = youtubeTrailersList[0];
    const youtubeTrailer: YoutubeTrailerEntity = await service.findOne(storedYoutubeTrailer.id);
    expect(youtubeTrailer).not.toBeNull();
    expect(youtubeTrailer.name).toEqual(storedYoutubeTrailer.name);
    expect(youtubeTrailer.url).toEqual(storedYoutubeTrailer.url);
    expect(youtubeTrailer.duration).toEqual(storedYoutubeTrailer.duration);
    expect(youtubeTrailer.channel).toEqual(storedYoutubeTrailer.channel);
  });

  it('findOne should throw an exception for an invalid youtube trailer', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The youtube trailer with the given id was not found");
  });

  it('create should return a new youtube trailer', async () => {
    const youtubeTrailer: YoutubeTrailerEntity = {
      id: "",
      name: faker.name.firstName(),
      url: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      channel: faker.name.firstName(),
      movie
    };

    const newYoutubeTrailer: YoutubeTrailerEntity = await service.create(youtubeTrailer);
    expect(newYoutubeTrailer).not.toBeNull();

    const storedYoutubeTrailer: YoutubeTrailerEntity = await youtubeTrailerRepository.findOne({ where: { id: newYoutubeTrailer.id } });
    expect(storedYoutubeTrailer).not.toBeNull();
    expect(storedYoutubeTrailer.name).toEqual(youtubeTrailer.name);
    expect(storedYoutubeTrailer.url).toEqual(youtubeTrailer.url);
    expect(storedYoutubeTrailer.duration).toEqual(youtubeTrailer.duration);
    expect(storedYoutubeTrailer.channel).toEqual(youtubeTrailer.channel);
  });

  it('update should modify a youtube trailer', async () => {
    const youtubeTrailer: YoutubeTrailerEntity = youtubeTrailersList[0];
    youtubeTrailer.name = faker.name.firstName();
    youtubeTrailer.url = faker.image.imageUrl();
    youtubeTrailer.duration = faker.datatype.number();
    youtubeTrailer.channel = faker.name.firstName();

    const updatedYoutubeTrailer: YoutubeTrailerEntity = await service.update(youtubeTrailer.id, youtubeTrailer);
    expect(updatedYoutubeTrailer).not.toBeNull();
    const storedYoutubeTrailer: YoutubeTrailerEntity = await youtubeTrailerRepository.findOne({ where: { id: youtubeTrailer.id } });
    expect(storedYoutubeTrailer).not.toBeNull();
    expect(storedYoutubeTrailer.name).toEqual(youtubeTrailer.name);
    expect(storedYoutubeTrailer.url).toEqual(youtubeTrailer.url);
    expect(storedYoutubeTrailer.duration).toEqual(youtubeTrailer.duration);
    expect(storedYoutubeTrailer.channel).toEqual(youtubeTrailer.channel);
  });

  it('update should throw an exception for an invalid youtube trailer', async () => {
    let youtubeTrailer: YoutubeTrailerEntity = youtubeTrailersList[0];
    youtubeTrailer = {
      ...youtubeTrailer,
      name: faker.name.firstName(),
      url: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      channel: faker.name.firstName(),
    };
    await expect(() => service.update("0", youtubeTrailer)).rejects.toHaveProperty("message", "The youtube trailer with the given id was not found");
  });

  it('delete should remove a youtube trailer', async () => {
    const youtubeTrailer: YoutubeTrailerEntity = youtubeTrailersList[0];
    await service.delete(youtubeTrailer.id);
    const storedYoutubeTrailer: YoutubeTrailerEntity = await youtubeTrailerRepository.findOne({ where: { id: youtubeTrailer.id } });
    expect(storedYoutubeTrailer).toBeNull();
  });

  it('delete should throw an exception for an invalid youtube trailer', async () => {
    const youtubeTrailer: YoutubeTrailerEntity = youtubeTrailersList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The youtube trailer with the given id was not found");
  });

});
