import { Module } from '@nestjs/common';
import { PlatformMovieService } from './platform-movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from '../platform/platform.entity';
import { MovieEntity } from '../movie/movie.entity';
import { PlatformMovieController } from './platform-movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity, MovieEntity])],
  providers: [PlatformMovieService],
  controllers: [PlatformMovieController]
})
export class PlatformMovieModule { }
