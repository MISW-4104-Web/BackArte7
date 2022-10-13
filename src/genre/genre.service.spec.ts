import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GenreEntity } from './genre.entity';
import { GenreService } from './genre.service';
import { faker } from '@faker-js/faker';

describe('GenreService', () => {
  let service: GenreService;
  let repository: Repository<GenreEntity>;
  let genresList: GenreEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GenreService],
    }).compile();

    service = module.get<GenreService>(GenreService);
    repository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    genresList = [];
    for (let i = 0; i < 5; i++) {
      const genre: GenreEntity = await repository.save({
        type: faker.name.firstName()
      });
      genresList.push(genre);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all genres', async () => {
    const genres: GenreEntity[] = await service.findAll();
    expect(genres).not.toBeNull();
    expect(genres).toHaveLength(genresList.length);
  });

  it('findOne should return a genre by id', async () => {
    const storedGenre: GenreEntity = genresList[0];
    const genre: GenreEntity = await service.findOne(storedGenre.id);
    expect(genre).not.toBeNull();
    expect(genre.type).toEqual(storedGenre.type);
  });

  it('findOne should throw an exception for an invalid genre', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('create should return a new genre', async () => {
    const genre: GenreEntity = {
      id: "",
      type: faker.name.firstName(),
      movies: []
    };

    const createdGenre: GenreEntity = await service.create(genre);
    expect(createdGenre).not.toBeNull();

    const storedGenre: GenreEntity = await service.findOne(createdGenre.id);
    expect(storedGenre).not.toBeNull();
    expect(storedGenre.type).toEqual(genre.type);
  });

  it('update should modify a genre', async () => {
    const genre: GenreEntity = genresList[0];
    genre.type = faker.name.firstName();

    const updatedGenre: GenreEntity = await service.update(genre.id, genre);
    expect(updatedGenre).not.toBeNull();
    const storedGenre: GenreEntity = await service.findOne(genre.id);
    expect(storedGenre).not.toBeNull();
    expect(storedGenre.type).toEqual(genre.type);
  });

  it('update should throw an exception for an invalid genre', async () => {
    let genre: GenreEntity = genresList[0];
    genre = {
      ...genre,
      type: faker.name.firstName()
    };
    await expect(() => service.update("0", genre)).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

  it('delete should remove a genre', async () => {
    const genre: GenreEntity = genresList[0];
    await service.delete(genre.id);
    const deletedGenre: GenreEntity = await repository.findOne({ where: { id: genre.id } });
    expect(deletedGenre).toBeNull();
  });

  it('delete should throw an exception for an invalid genre', async () => {
    const genre: GenreEntity = genresList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The genre with the given id was not found");
  });

});
