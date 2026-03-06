import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeController } from './prize.controller';
import { PrizeService } from './prize.service';
import { PrizeEntity } from './prize.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeEntity])],
  providers: [PrizeService],
  controllers: [PrizeController]
})
export class PrizeModule { }
