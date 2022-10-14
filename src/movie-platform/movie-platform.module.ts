import { Module } from '@nestjs/common';
import { MoviePlatformService } from './movie-platform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from '../platform/platform.entity';
import { MovieEntity } from '../movie/movie.entity';
import { MoviePlatformController } from './movie-platform.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity, MovieEntity])],
  providers: [MoviePlatformService],
  controllers: [MoviePlatformController]
})
export class MoviePlatformModule {}
 