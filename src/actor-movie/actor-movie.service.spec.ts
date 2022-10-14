import { Test, TestingModule } from '@nestjs/testing';
import { ActorMovieService } from './actor-movie.service';

describe('ActorMovieService', () => {
  let service: ActorMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorMovieService],
    }).compile();

    service = module.get<ActorMovieService>(ActorMovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
