import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../movie/movie.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { MoviePrizeService } from './movie-prize.service';
import { MoviePrizeController } from './movie-prize.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, PrizeEntity])],
  providers: [MoviePrizeService],
  controllers: [MoviePrizeController],
})
export class MoviePrizeModule {}
