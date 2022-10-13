import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorController } from './director.controller';
import { DirectorService } from './director.service';
import { DirectorEntity } from './director.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DirectorEntity])],
  providers: [DirectorService],
  controllers: [DirectorController]
})
export class DirectorModule { }
