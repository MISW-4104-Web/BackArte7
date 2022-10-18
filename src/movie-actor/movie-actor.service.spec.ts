import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MovieEntity } from '../movie/movie.entity';
import { ActorEntity } from '../actor/actor.entity';
import { MovieActorService } from './movie-actor.service';
import { faker } from '@faker-js/faker';

describe('MovieActorService', () => {
  let service: MovieActorService;
  let movieRepository: Repository<MovieEntity>;
  let actorRepository: Repository<ActorEntity>;
  let movie: MovieEntity;
  let actorsList: ActorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MovieActorService],
    }).compile();

    service = module.get<MovieActorService>(MovieActorService);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    actorRepository = module.get<Repository<ActorEntity>>(getRepositoryToken(ActorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    movieRepository.clear();
    actorRepository.clear();
    actorsList = [];
    for (let i = 0; i < 5; i++) {
      const actor: ActorEntity = await actorRepository.save({
        name: faker.name.firstName(),
        photo: faker.image.imageUrl(),
        nationality: faker.address.country(),
        birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
        biography: faker.lorem.sentence()
      });
      actorsList.push(actor);
    }

    movie = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      actors: actorsList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addActorToMovie should return a movie with the actor added', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    const updatedMovie = await service.addActorToMovie(movie.id, actor.id);
    expect(updatedMovie.actors.length).toEqual(actorsList.length + 1);
  });

  it('addActorToMovie should throw an exception for an invalid movie', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    await expect(service.addActorToMovie("0", actor.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('addActorToMovie should throw an exception for an invalid actor', async () => {
    await expect(service.addActorToMovie(movie.id, "0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('findActorsFromMovie should return a list of actors from a movie', async () => {
    const actors = await service.findActorsFromMovie(movie.id);
    expect(actors.length).toEqual(actorsList.length);
  });

  it('findActorsFromMovie should throw an exception for an invalid movie', async () => {
    await expect(service.findActorsFromMovie("0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findActorFromMovie should return a actor from a movie', async () => {
    const actor = actorsList[0];
    const storedActor = await service.findActorFromMovie(movie.id, actor.id);
    expect(storedActor).not.toBeNull();
    expect(storedActor.name).toEqual(actor.name);
    expect(storedActor.photo).toEqual(actor.photo);
    expect(storedActor.nationality).toEqual(actor.nationality);
    expect(storedActor.birthDate).toEqual(actor.birthDate);
    expect(storedActor.biography).toEqual(actor.biography);
  });

  it('findActorFromMovie should throw an exception for an invalid movie', async () => {
    const actor = actorsList[0];
    await expect(service.findActorFromMovie("0", actor.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findActorFromMovie should throw an exception for an invalid actor', async () => {
    await expect(service.findActorFromMovie(movie.id, "0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('findActorFromMovie should throw an exception for a non associated actor', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    await expect(service.findActorFromMovie(movie.id, actor.id)).rejects.toHaveProperty("message", "The actor with the given id is not associated to the movie");
  });

  it('updateActorsFromMovie should return a movie with the actors updated', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    const updatedMovie = await service.updateActorsFromMovie(movie.id, [actor]);
    expect(updatedMovie.actors.length).toEqual(1);
    expect(updatedMovie.actors[0].name).toEqual(actor.name);
    expect(updatedMovie.actors[0].photo).toEqual(actor.photo);
    expect(updatedMovie.actors[0].nationality).toEqual(actor.nationality);
    expect(updatedMovie.actors[0].birthDate).toEqual(actor.birthDate);
    expect(updatedMovie.actors[0].biography).toEqual(actor.biography);
  });

  it('updateActorsFromMovie should throw an exception for an invalid movie', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    await expect(service.updateActorsFromMovie("0", [actor])).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('updateActorsFromMovie should throw an exception for an invalid actor', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    await expect(service.updateActorsFromMovie(movie.id, [actor, { id: "0" } as ActorEntity])).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('deleteActorFromMovie should delete a actor from a movie', async () => {
    const actor = actorsList[0];

    await service.deleteActorFromMovie(movie.id, actor.id);

    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id }, relations: ['actors'] });
    const deletedActor = storedMovie.actors.find(a => a.id === actor.id);

    expect(deletedActor).toBeUndefined();
  });

  it('deleteActorFromMovie should throw an exception for an invalid movie', async () => {
    const actor = actorsList[0];
    await expect(service.deleteActorFromMovie("0", actor.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('deleteActorFromMovie should throw an exception for an invalid actor', async () => {
    await expect(service.deleteActorFromMovie(movie.id, "0")).rejects.toHaveProperty("message", "The actor with the given id was not found");
  });

  it('deleteActorFromMovie should throw an exception for a non associated movie', async () => {
    const actor: ActorEntity = await actorRepository.save({
      name: faker.name.firstName(),
      photo: faker.image.imageUrl(),
      nationality: faker.address.country(),
      birthDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      biography: faker.lorem.sentence()
    });

    await expect(service.deleteActorFromMovie(movie.id, actor.id)).rejects.toHaveProperty("message", "The actor with the given id is not associated to the movie");
  });

});
