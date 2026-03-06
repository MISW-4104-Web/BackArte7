import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeActorService } from './prize-actor.service';
import { faker } from '@faker-js/faker';

describe('PrizeActorService', () => {
  let service: PrizeActorService;
  let prizeRepository: Repository<PrizeEntity>;
  let actorRepository: Repository<ActorEntity>;
  let prize: PrizeEntity;
  let actorsList: ActorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrizeActorService],
    }).compile();

    service = module.get<PrizeActorService>(PrizeActorService);
    prizeRepository = module.get<Repository<PrizeEntity>>(getRepositoryToken(PrizeEntity));
    actorRepository = module.get<Repository<ActorEntity>>(getRepositoryToken(ActorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    prizeRepository.clear();
    actorRepository.clear();
    actorsList = [];
    for (let i = 0; i < 5; i++) {
      const actor: ActorEntity = await actorRepository.save({
        name: faker.name.firstName(),
        photo: faker.image.imageUrl(),
        nationality: faker.address.country(),
        birthDate: faker.date.past(),
        biography: faker.lorem.sentence(),
      });
      actorsList.push(actor);
    }

    prize = await prizeRepository.save({
      name: faker.lorem.word(),
      category: faker.lorem.word(),
      year: faker.datatype.number({ min: 1900, max: 2025 }),
      status: faker.helpers.arrayElement(['won', 'nominated']),
      actors: actorsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addActorToPrize should return a prize with the actor added', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    const updatedPrize = await service.addActorToPrize(prize.id, actor.id);
    expect(updatedPrize.actors.length).toEqual(actorsList.length + 1);
  });

  it('addActorToPrize should throw an exception for an invalid prize', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.addActorToPrize('0', actor.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('addActorToPrize should throw an exception for an invalid actor', async () => {
    await expect(service.addActorToPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('findActorsFromPrize should return a list of actors from a prize', async () => {
    const actors = await service.findActorsFromPrize(prize.id);
    expect(actors.length).toEqual(actorsList.length);
  });

  it('findActorsFromPrize should throw an exception for an invalid prize', async () => {
    await expect(service.findActorsFromPrize('0')).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findActorFromPrize should return an actor from a prize', async () => {
    const actor = actorsList[0];
    const storedActor = await service.findActorFromPrize(prize.id, actor.id);
    expect(storedActor).not.toBeNull();
    expect(storedActor.name).toEqual(actor.name);
  });

  it('findActorFromPrize should throw an exception for an invalid prize', async () => {
    const actor = actorsList[0];
    await expect(service.findActorFromPrize('0', actor.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('findActorFromPrize should throw an exception for an invalid actor', async () => {
    await expect(service.findActorFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('findActorFromPrize should throw an exception for a non associated actor', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.findActorFromPrize(prize.id, actor.id)).rejects.toHaveProperty('message', 'The actor with the given id is not associated to the prize');
  });

  it('updateActorsFromPrize should return a prize with the actors updated', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    const updatedPrize = await service.updateActorsFromPrize(prize.id, [actor]);
    expect(updatedPrize.actors.length).toEqual(1);
    expect(updatedPrize.actors[0].name).toEqual(actor.name);
  });

  it('updateActorsFromPrize should throw an exception for an invalid prize', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.updateActorsFromPrize('0', [actor])).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('updateActorsFromPrize should throw an exception for an invalid actor', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.updateActorsFromPrize(prize.id, [actor, { id: '0' } as ActorEntity])).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('deleteActorFromPrize should delete an actor from a prize', async () => {
    const actor = actorsList[0];

    await service.deleteActorFromPrize(prize.id, actor.id);

    const storedPrize: PrizeEntity = await prizeRepository.findOne({ where: { id: prize.id }, relations: ['actors'] });
    const deletedActor = storedPrize.actors.find(a => a.id === actor.id);

    expect(deletedActor).toBeUndefined();
  });

  it('deleteActorFromPrize should throw an exception for an invalid prize', async () => {
    const actor = actorsList[0];
    await expect(service.deleteActorFromPrize('0', actor.id)).rejects.toHaveProperty('message', 'The prize with the given id was not found');
  });

  it('deleteActorFromPrize should throw an exception for an invalid actor', async () => {
    await expect(service.deleteActorFromPrize(prize.id, '0')).rejects.toHaveProperty('message', 'The actor with the given id was not found');
  });

  it('deleteActorFromPrize should throw an exception for a non associated actor', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.past(),
      biography: faker.lorem.sentence(),
    });

    await expect(service.deleteActorFromPrize(prize.id, actor.id)).rejects.toHaveProperty('message', 'The actor with the given id is not associated to the prize');
  });
});
