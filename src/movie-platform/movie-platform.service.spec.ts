import { Test, TestingModule } from '@nestjs/testing';
import { MoviePlatformService } from './movie-platform.service';

describe('MoviePlatformService', () => {
  let service: MoviePlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviePlatformService],
    }).compile();

    service = module.get<MoviePlatformService>(MoviePlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
