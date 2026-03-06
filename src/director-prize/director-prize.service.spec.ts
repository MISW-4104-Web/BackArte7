import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DirectorEntity } from '../director/director.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorPrizeService } from './director-prize.service';
import { faker } from '@faker-js/faker';

describe('DirectorPrizeService', () => {
  let service: DirectorPrizeService;
  let directorRepository: Repository<DirectorEntity>;
  let prizeRepository: Repository<PrizeEntity>;
  let director: DirectorEntity;
  let prizesList: PrizeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DirectorPrizeService],
    }).compile();

    service = module.get<DirectorPrizeService>(DirectorPrizeService);
    directorRepository = module.get<Repository<DirectorEntity>>(getRepositoryToken(DirectorEntity));
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    directorRepository.clear();
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

    director = await directorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
      prizes: prizesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPrizeToDirector should return a director with the prize added', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedDirector = await service.addPrizeToDirector(director.id, prize.id);
    expect(updatedDirector.prizes.length).toEqual(prizesList.length + 1);
  });

  it('addPrizeToDirector should throw an exception for an invalid director', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.addPrizeToDirector('0', prize.id)).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('addPrizeToDirector should throw an exception for an invalid prize', async () => {
    await expect(service.addPrizeToDirector(director.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizesFromDirector should return a list of prizes from a director', async () => {
    const prizes = await service.findPrizesFromDirector(director.id);
    expect(prizes.length).toEqual(prizesList.length);
  });

  it('findPrizesFromDirector should throw an exception for an invalid director', async () => {
    await expect(service.findPrizesFromDirector('0')).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('findPrizeFromDirector should return a prize from a director', async () => {
    const prize = prizesList[0];
    const storedPrize = await service.findPrizeFromDirector(director.id, prize.id);
    expect(storedPrize).not.toBeNull();
    expect(storedPrize.name).toEqual(prize.name);
  });

  it('findPrizeFromDirector should throw an exception for an invalid director', async () => {
    const prize = prizesList[0];
    await expect(service.findPrizeFromDirector('0', prize.id)).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('findPrizeFromDirector should throw an exception for an invalid prize', async () => {
    await expect(service.findPrizeFromDirector(director.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizeFromDirector should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.findPrizeFromDirector(director.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the director');
  });

  it('updatePrizesFromDirector should return a director with the prizes updated', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedDirector = await service.updatePrizesFromDirector(director.id, [prize]);
    expect(updatedDirector.prizes.length).toEqual(1);
    expect(updatedDirector.prizes[0].name).toEqual(prize.name);
  });

  it('updatePrizesFromDirector should throw an exception for an invalid director', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromDirector('0', [prize])).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('updatePrizesFromDirector should throw an exception for an invalid prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromDirector(director.id, [prize, { id: '0' } as PrizeEntity])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromDirector should delete a prize from a director', async () => {
    const prize = prizesList[0];

    await service.deletePrizeFromDirector(director.id, prize.id);

    const storedDirector: DirectorEntity = await directorRepository.findOne({ where: { id: director.id }, relations: ['prizes'] });
    const deletedPrize = storedDirector.prizes.find(p => p.id === prize.id);

    expect(deletedPrize).toBeUndefined();
  });

  it('deletePrizeFromDirector should throw an exception for an invalid director', async () => {
    const prize = prizesList[0];
    await expect(service.deletePrizeFromDirector('0', prize.id)).rejects.toHaveProperty('message', 'The director with the given id was not found');
  });

  it('deletePrizeFromDirector should throw an exception for an invalid prize', async () => {
    await expect(service.deletePrizeFromDirector(director.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromDirector should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.deletePrizeFromDirector(director.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the director');
  });
});
