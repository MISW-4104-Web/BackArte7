import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorEntity } from '../director/director.entity';
import { PrizeDirectorService } from './prize-director.service';
import { PrizeDirectorController } from './prize-director.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeEntity, DirectorEntity])],
  providers: [PrizeDirectorService],
  controllers: [PrizeDirectorController],
})
export class PrizeDirectorModule {}
