import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActorEntity } from './actor.entity';
import { ActorService } from './actor.service';
import { faker } from '@faker-js/faker';

describe('ActorService', () => {
  let service: ActorService;
  let repository: Repository<ActorEntity>;
  let actorsList: ActorEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActorService],
    }).compile();

    service = module.get<ActorService>(ActorService);
    repository = module.get<Repository<ActorEntity>>(getRepositoryToken(ActorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    actorsList = [];
    for (let i = 0; i < 5; i++) {
      const actor: ActorEntity = await repository.save({
        name: faker.name.firstName(),
        photo: faker.image.imageUrl(),
        nationality: faker.address.country(),
        birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
        biography: faker.lorem.sentence()
      });
      actorsList.push(actor);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all actors', async () => {
    const actors: ActorEntity[] = await service.findAll();
    expect(actors).not.toBeNull();
    expect(actors).toHaveLength(actorsList.length);
  });

  it('findOne should return a actor by id', async () => {
    const storedActor: ActorEntity = actorsList[0];
    const actor: ActorEntity = await service.findOne(storedActor.id);
    expect(actor).not.toBeNull();
    expect(actor.name).toEqual(storedActor.name);
    expect(actor.photo).toEqual(storedActor.photo);
    expect(actor.nationality).toEqual(storedActor.nationality);
    expect(actor.birthDate).toEqual(storedActor.birthDate);
    expect(actor.biography).toEqual(storedActor.biography);
  });

  it('findOne should throw an exception for an invalid actor', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('create should return a new actor', async () => {
    const actor: ActorEntity = {
      id: "",
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence(),
      movies: []
    };

    const newActor: ActorEntity = await service.create(actor);
    expect(newActor).not.toBeNull();

    const storedActor: ActorEntity = await repository.findOne({ where: { id: newActor.id } });
    expect(storedActor).not.toBeNull();
    expect(storedActor.name).toEqual(newActor.name);
    expect(storedActor.photo).toEqual(newActor.photo);
    expect(storedActor.nationality).toEqual(newActor.nationality);
    expect(storedActor.birthDate).toEqual(newActor.birthDate);
    expect(storedActor.biography).toEqual(newActor.biography);
  });

  it('update should modify a actor', async () => {
    const actor: ActorEntity = actorsList[0];
    actor.name = faker.name.firstName();
    actor.photo = faker.image.imageUrl();
    actor.nationality = faker.address.country();
    actor.birthDate = faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z');
    actor.biography = faker.lorem.sentence();

    const updatedActor: ActorEntity = await service.update(actor.id, actor);
    expect(updatedActor).not.toBeNull();
    const storedActor: ActorEntity = await repository.findOne({ where: { id: actor.id } });
    expect(storedActor).not.toBeNull();
    expect(storedActor.name).toEqual(actor.name);
    expect(storedActor.photo).toEqual(actor.photo);
    expect(storedActor.nationality).toEqual(actor.nationality);
    expect(storedActor.birthDate).toEqual(actor.birthDate);
    expect(storedActor.biography).toEqual(actor.biography);
  });

  it('update should throw an exception for an invalid actor', async () => {
    let actor: ActorEntity = actorsList[0];
    actor = {
      ...actor,
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    };
    await expect(() => service.update("0", actor)).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('delete should remove a actor', async () => {
    const actor: ActorEntity = actorsList[0];
    await service.delete(actor.id);
    const deletedActor: ActorEntity = await repository.findOne({ where: { id: actor.id } });
    expect(deletedActor).toBeNull();
  });

  it('delete should throw an exception for an invalid actor', async () => {
    const actor: ActorEntity = actorsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

});
