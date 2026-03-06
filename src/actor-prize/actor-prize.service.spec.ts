import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorPrizeService } from './actor-prize.service';
import { faker } from '@faker-js/faker';

describe('ActorPrizeService', () => {
  let service: ActorPrizeService;
  let actorRepository: Repository<ActorEntity>;
  let prizeRepository: Repository<PrizeEntity>;
  let actor: ActorEntity;
  let prizesList: PrizeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActorPrizeService],
    }).compile();

    service = module.get<ActorPrizeService>(ActorPrizeService);
    actorRepository = module.get<Repository<ActorEntity>>(getRepositoryToken(ActorEntity));
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    actorRepository.clear();
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

    actor = await actorRepository.save({
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

  it('addPrizeToActor should return a actor with the prize added', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedActor = await service.addPrizeToActor(actor.id, prize.id);
    expect(updatedActor.prizes.length).toEqual(prizesList.length + 1);
  });

  it('addPrizeToActor should throw an exception for an invalid actor', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.addPrizeToActor('0', prize.id)).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('addPrizeToActor should throw an exception for an invalid prize', async () => {
    await expect(service.addPrizeToActor(actor.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizesFromActor should return a list of prizes from a actor', async () => {
    const prizes = await service.findPrizesFromActor(actor.id);
    expect(prizes.length).toEqual(prizesList.length);
  });

  it('findPrizesFromActor should throw an exception for an invalid actor', async () => {
    await expect(service.findPrizesFromActor('0')).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('findPrizeFromActor should return a prize from a actor', async () => {
    const prize = prizesList[0];
    const storedPrize = await service.findPrizeFromActor(actor.id, prize.id);
    expect(storedPrize).not.toBeNull();
    expect(storedPrize.name).toEqual(prize.name);
    expect(storedPrize.category).toEqual(prize.category);
    expect(storedPrize.year).toEqual(prize.year);
    expect(storedPrize.status).toEqual(prize.status);
  });

  it('findPrizeFromActor should throw an exception for an invalid actor', async () => {
    const prize = prizesList[0];
    await expect(service.findPrizeFromActor('0', prize.id)).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('findPrizeFromActor should throw an exception for an invalid prize', async () => {
    await expect(service.findPrizeFromActor(actor.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findPrizeFromActor should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.findPrizeFromActor(actor.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the actor');
  });

  it('updatePrizesFromActor should return a actor with the prizes updated', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    const updatedActor = await service.updatePrizesFromActor(actor.id, [prize]);
    expect(updatedActor.prizes.length).toEqual(1);
    expect(updatedActor.prizes[0].name).toEqual(prize.name);
  });

  it('updatePrizesFromActor should throw an exception for an invalid actor', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromActor('0', [prize])).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('updatePrizesFromActor should throw an exception for an invalid prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.updatePrizesFromActor(actor.id, [prize, { id: '0' } as PrizeEntity])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromActor should delete a prize from a actor', async () => {
    const prize = prizesList[0];

    await service.deletePrizeFromActor(actor.id, prize.id);

    const storedActor: ActorEntity = await actorRepository.findOne({ where: { id: actor.id }, relations: ['prizes'] });
    const deletedPrize = storedActor.prizes.find(p => p.id === prize.id);

    expect(deletedPrize).toBeUndefined();
  });

  it('deletePrizeFromActor should throw an exception for an invalid actor', async () => {
    const prize = prizesList[0];
    await expect(service.deletePrizeFromActor('0', prize.id)).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('deletePrizeFromActor should throw an exception for an invalid prize', async () => {
    await expect(service.deletePrizeFromActor(actor.id, '0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deletePrizeFromActor should throw an exception for a non associated prize', async () => {
    const prize: PrizeEntity = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
    });

    await expect(service.deletePrizeFromActor(actor.id, prize.id)).rejects.toHaveProperty('message', 'The prize with the given id is not associated to the actor');
  });
});
