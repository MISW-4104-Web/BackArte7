import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutubeTrailerController } from './youtube-trailer.controller';
import { YoutubeTrailerService } from './youtube-trailer.service';
import { YoutubeTrailerEntity } from './youtube-trailer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YoutubeTrailerEntity])],
  providers: [YoutubeTrailerService],
  controllers: [YoutubeTrailerController]
})
export class YoutubeTrailerModule { }
