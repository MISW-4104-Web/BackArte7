import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DirectorEntity } from './director.entity';
import { DirectorService } from './director.service';
import { faker } from '@faker-js/faker';

describe('DirectorService', () => {
  let service: DirectorService;
  let repository: Repository<DirectorEntity>;
  let directorsList: DirectorEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DirectorService],
    }).compile();

    service = module.get<DirectorService>(DirectorService);
    repository = module.get<Repository<DirectorEntity>>(getRepositoryToken(DirectorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    directorsList = [];
    for (let i = 0; i < 5; i++) {
      const director: DirectorEntity = await repository.save({
        name: faker.name.firstName(),
        photo: faker.image.imageUrl(),
        nationality: faker.address.country(),
        birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
        biography: faker.lorem.sentence()
      });
      directorsList.push(director);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all directors', async () => {
    const directors: DirectorEntity[] = await service.findAll();
    expect(directors).not.toBeNull();
    expect(directors).toHaveLength(directorsList.length);
  });

  it('findOne should return a director by id', async () => {
    const storedDirector: DirectorEntity = directorsList[0];
    const director: DirectorEntity = await service.findOne(storedDirector.id);
    expect(director).not.toBeNull();
    expect(director.name).toEqual(storedDirector.name);
    expect(director.photo).toEqual(storedDirector.photo);
    expect(director.nationality).toEqual(storedDirector.nationality);
    expect(director.birthDate).toEqual(storedDirector.birthDate);
    expect(director.biography).toEqual(storedDirector.biography);
  });

  it('findOne should throw an exception for an invalid director', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The director with the given id was not found");
  });


  it('create should return a new director', async () => {
    const director: DirectorEntity = {
      id: "",
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence(),
      movies: []
    };

    const newDirector: DirectorEntity = await service.create(director);
    expect(newDirector).not.toBeNull();

    const storedDirector: DirectorEntity = await repository.findOne({ where: { id: newDirector.id } });
    expect(storedDirector).not.toBeNull();
    expect(storedDirector.name).toEqual(newDirector.name);
    expect(storedDirector.photo).toEqual(newDirector.photo);
    expect(storedDirector.nationality).toEqual(newDirector.nationality);
    expect(storedDirector.birthDate).toEqual(newDirector.birthDate);
    expect(storedDirector.biography).toEqual(newDirector.biography);
    expect(storedDirector.biography).toEqual(newDirector.biography);
  });

  it('update should modify a director', async () => {
    const director: DirectorEntity = directorsList[0];
    director.name = faker.name.firstName();
    director.photo = faker.image.imageUrl();
    director.nationality = faker.address.country();
    director.birthDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    director.biography = faker.lorem.sentence();

    const updatedDirector: DirectorEntity = await service.update(director.id, director);
    expect(updatedDirector).not.toBeNull();
    const storedDirector: DirectorEntity = await repository.findOne({ where: { id: director.id } });
    expect(storedDirector).not.toBeNull();
    expect(storedDirector.name).toEqual(director.name);
    expect(storedDirector.photo).toEqual(director.photo);
    expect(storedDirector.nationality).toEqual(director.nationality);
    expect(storedDirector.birthDate).toEqual(director.birthDate);
    expect(storedDirector.biography).toEqual(director.biography);
  });

  it('update should throw an exception for an invalid director', async () => {
    let director: DirectorEntity = directorsList[0];
    director = {
      ...director,
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    };
    await expect(() => service.update("0", director)).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

  it('delete should remove a director', async () => {
    const director: DirectorEntity = directorsList[0];
    await service.delete(director.id);
    const deletedDirector: DirectorEntity = await repository.findOne({ where: { id: director.id } });
    expect(deletedDirector).toBeNull();
  });

  it('delete should throw an exception for an invalid director', async () => {
    const director: DirectorEntity = directorsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The director with the given id was not found");
  });

});
