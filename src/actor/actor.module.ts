import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { ActorEntity } from './actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActorEntity])],
  providers: [ActorService],
  controllers: [ActorController]
})
export class ActorModule { }
