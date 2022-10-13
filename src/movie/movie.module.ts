import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieEntity } from './movie.entity';
import { YoutubeTrailerEntity } from '../youtube-trailer/youtube-trailer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, YoutubeTrailerEntity])],
  providers: [MovieService],
  controllers: [MovieController]
})
export class MovieModule { }
