import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PlatformEntity } from './platform.entity';
import { PlatformService } from './platform.service';
import { faker } from '@faker-js/faker';

describe('PlatformService', () => {
  let service: PlatformService;
  let repository: Repository<PlatformEntity>;
  let platformsList: PlatformEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlatformService],
    }).compile();

    service = module.get<PlatformService>(PlatformService);
    repository = module.get<Repository<PlatformEntity>>(getRepositoryToken(PlatformEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    platformsList = [];
    for (let i = 0; i < 5; i++) {
      const platform: PlatformEntity = await repository.save({
        name: faker.name.firstName(),
        url: faker.internet.url()
      });
      platformsList.push(platform);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all platforms', async () => {
    const platforms: PlatformEntity[] = await service.findAll();
    expect(platforms).not.toBeNull();
    expect(platforms).toHaveLength(platformsList.length);
  });

  it('findOne should return a platform by id', async () => {
    const storedPlatform: PlatformEntity = platformsList[0];
    const platform: PlatformEntity = await service.findOne(storedPlatform.id);
    expect(platform).not.toBeNull();
    expect(platform.name).toEqual(storedPlatform.name);
    expect(platform.url).toEqual(storedPlatform.url);
  });

  it('findOne should throw an exception for an invalid platform', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('create should return a new platform', async () => {
    const platform: PlatformEntity = {
      id: "",
      name: faker.name.firstName(),
      url: faker.internet.url(),
      movies: []
    };

    const newPlatform: PlatformEntity = await service.create(platform);
    expect(newPlatform).not.toBeNull();

    const storedPlatform: PlatformEntity = await service.findOne(newPlatform.id);
    expect(storedPlatform).not.toBeNull();
    expect(storedPlatform.name).toEqual(platform.name);
    expect(storedPlatform.url).toEqual(platform.url);
  });

  it('update should modify a platform', async () => {
    const platform: PlatformEntity = platformsList[0];
    platform.name = faker.name.firstName();
    platform.url = faker.internet.url();

    const updatedPlatform: PlatformEntity = await service.update(platform.id, platform);
    expect(updatedPlatform).not.toBeNull();
    const storedPlatform: PlatformEntity = await repository.findOne({ where: { id: platform.id } });
    expect(storedPlatform).not.toBeNull();
    expect(storedPlatform.name).toEqual(platform.name);
    expect(storedPlatform.url).toEqual(platform.url);
  });

  it('update should throw an exception for an invalid platform', async () => {
    let platform: PlatformEntity = platformsList[0];
    platform = {
      ...platform,
      name: faker.name.firstName(),
      url: faker.internet.url(),
    };
    await expect(() => service.update("0", platform)).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

  it('delete should remove a platform', async () => {
    const platform: PlatformEntity = platformsList[0];
    await service.delete(platform.id);
    const deletedPlatform: PlatformEntity = await repository.findOne({ where: { id: platform.id } });
    expect(deletedPlatform).toBeNull();
  });

  it('delete should throw an exception for an invalid platform', async () => {
    const platform: PlatformEntity = platformsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The platform with the given id was not found");
  });

});
