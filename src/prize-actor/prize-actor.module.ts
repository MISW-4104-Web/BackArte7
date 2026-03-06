import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeActorService } from './prize-actor.service';
import { PrizeActorController } from './prize-actor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeEntity, ActorEntity])],
  providers: [PrizeActorService],
  controllers: [PrizeActorController],
})
export class PrizeActorModule {}
