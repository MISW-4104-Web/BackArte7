import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorPrizeService } from './actor-prize.service';
import { ActorPrizeController } from './actor-prize.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActorEntity, PrizeEntity])],
  providers: [ActorPrizeService],
  controllers: [ActorPrizeController],
})
export class ActorPrizeModule {}
