import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';
import { PlatformEntity } from './platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity])],
  providers: [PlatformService],
  controllers: [PlatformController]
})
export class PlatformModule { }
