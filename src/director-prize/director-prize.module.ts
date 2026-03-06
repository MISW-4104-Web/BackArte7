import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorEntity } from '../director/director.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorPrizeService } from './director-prize.service';
import { DirectorPrizeController } from './director-prize.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DirectorEntity, PrizeEntity])],
  providers: [DirectorPrizeService],
  controllers: [DirectorPrizeController],
})
export class DirectorPrizeModule {}
