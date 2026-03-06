import { Test, TestingModule } from '@nestjs/testing';
import { PrizeService } from './prize.service';

describe('PrizeService', () => {
  let service: PrizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizeService],
    }).compile();

    service = module.get<PrizeService>(PrizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
