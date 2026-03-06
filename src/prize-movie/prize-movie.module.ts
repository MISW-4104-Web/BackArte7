import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeEntity } from '../prize/prize.entity';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeMovieService } from './prize-movie.service';
import { PrizeMovieController } from './prize-movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeEntity, MovieEntity])],
  providers: [PrizeMovieService],
  controllers: [PrizeMovieController],
})
export class PrizeMovieModule {}
