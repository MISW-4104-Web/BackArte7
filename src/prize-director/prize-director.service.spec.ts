import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorEntity } from '../director/director.entity';
import { PrizeDirectorService } from './prize-director.service';
import { faker } from '@faker-js/faker';

describe('PrizeDirectorService', () => {
  let service: PrizeDirectorService;
  let prizeRepository: Repository<PrizeEntity>;
  let directorRepository: Repository<DirectorEntity>;
  let prize: PrizeEntity;
  let directorsList: DirectorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrizeDirectorService],
    }).compile();

    service = module.get<PrizeDirectorService>(PrizeDirectorService);
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    directorRepository = module.get<Repository<DirectorEntity>>(getRepositoryToken(DirectorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    prizeRepository.clear();
    directorRepository.clear();
    directorsList = [];
    for (let i = 0; i < 5; i++) {
      const director: DirectorEntity = await directorRepository.save({
        name: faker.name.firstName(),
        photo: faker.image.imageUrl(),
        nationality: faker.address.country(),
        birthDate: faker.date.past(),
        biography: faker.lorem.sentence(),
      });
      directorsList.push(director);
    }

    prize = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
      directors: directorsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDirectorToPrize should return a prize with the director added', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    const updatedPrize = await service.addDirectorToPrize(prize.id, director.id);
    expect(updatedPrize.directors.length).toEqual(directorsList.length + 1);
  });

  it('addDirectorToPrize should throw an exception for an invalid prize', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.addDirectorToPrize('0', director.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('addDirectorToPrize should throw an exception for an invalid director', async () => {
    await expect(service.addDirectorToPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('findDirectorsFromPrize should return a list of directors from a prize', async () => {
    const directors = await service.findDirectorsFromPrize(prize.id);
    expect(directors.length).toEqual(directorsList.length);
  });

  it('findDirectorsFromPrize should throw an exception for an invalid prize', async () => {
    await expect(service.findDirectorsFromPrize('0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findDirectorFromPrize should return a director from a prize', async () => {
    const director = directorsList[0];
    const storedDirector = await service.findDirectorFromPrize(prize.id, director.id);
    expect(storedDirector).not.toBeNull();
    expect(storedDirector.name).toEqual(director.name);
  });

  it('findDirectorFromPrize should throw an exception for an invalid prize', async () => {
    const director = directorsList[0];
    await expect(service.findDirectorFromPrize('0', director.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findDirectorFromPrize should throw an exception for an invalid director', async () => {
    await expect(service.findDirectorFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('findDirectorFromPrize should throw an exception for a non associated director', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.findDirectorFromPrize(prize.id, director.id)).rejects.toHaveProperty('message', 'The director with the given id is not associated to the prize');
  });

  it('updateDirectorsFromPrize should return a prize with the directors updated', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    const updatedPrize = await service.updateDirectorsFromPrize(prize.id, [director]);
    expect(updatedPrize.directors.length).toEqual(1);
    expect(updatedPrize.directors[0].name).toEqual(director.name);
  });

  it('updateDirectorsFromPrize should throw an exception for an invalid prize', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.updateDirectorsFromPrize('0', [director])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('updateDirectorsFromPrize should throw an exception for an invalid director', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.updateDirectorsFromPrize(prize.id, [director, { id: '0' } as DirectorEntity])).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('deleteDirectorFromPrize should delete a director from a prize', async () => {
    const director = directorsList[0];

    await service.deleteDirectorFromPrize(prize.id, director.id);

    const storedPrize: PrizeEntity = await prizeRepository.findOne({ where: { id: prize.id }, relations: ['directors'] });
    const deletedDirector = storedPrize.directors.find(d => d.id === director.id);

    expect(deletedDirector).toBeUndefined();
  });

  it('deleteDirectorFromPrize should throw an exception for an invalid prize', async () => {
    const director = directorsList[0];
    await expect(service.deleteDirectorFromPrize('0', director.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deleteDirectorFromPrize should throw an exception for an invalid director', async () => {
    await expect(service.deleteDirectorFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('deleteDirectorFromPrize should throw an exception for a non associated director', async () => {
    const director: DirectorEntity = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.deleteDirectorFromPrize(prize.id, director.id)).rejects.toHaveProperty('message', 'The director with the given id is not associated to the prize');
  });
});
