/**
 * import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActorDto } from './actor.dto';
import { ActorEntity } from './actor.entity';
import { ActorService } from './actor.service';

@Controller('actors')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

    @Get()
    async findAll(): Promise<ActorEntity[]> {
        return await this.actorService.findAll();
    }

    @Get(':actorId')
    async findOne(@Param('actorId') actorId: string): Promise<ActorEntity> {
        return await this.actorService.findOne(actorId);
    }

    @Post()
    async create(@Body() actorDto: ActorDto): Promise<ActorEntity> {
        return await this.actorService.create(plainToInstance(ActorEntity, actorDto));
    }

    @Put(':actorId')
    async update(@Param('actorId') actorId: string, @Body() actorDto: ActorDto): Promise<ActorEntity> {
        return await this.actorService.update(actorId, plainToInstance(ActorEntity, actorDto));
    }

    @Delete(':actorId')
    @HttpCode(204)
    async delete(@Param('actorId') actorId: string): Promise<void> {
        await this.actorService.delete(actorId);
    }
    
}

 */

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PlatformDto } from './platform.dto';
import { PlatformEntity } from './platform.entity';
import { PlatformService } from './platform.service';

@Controller('platforms')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatformController {
    constructor(private readonly platformService: PlatformService) {}

    @Get()
    async findAll(): Promise<PlatformEntity[]> {
        return await this.platformService.findAll();
    }

    @Get(':platformId')
    async findOne(@Param('platformId') platformId: string): Promise<PlatformEntity> {
        return await this.platformService.findOne(platformId);
    }

    @Post()
    async create(@Body() platformDto: PlatformDto): Promise<PlatformEntity> {
        return await this.platformService.create(plainToInstance(PlatformEntity, platformDto));
    }

    @Put(':platformId')
    async update(@Param('platformId') platformId: string, @Body() platformDto: PlatformDto): Promise<PlatformEntity> {
        return await this.platformService.update(platformId, plainToInstance(PlatformEntity, platformDto));
    }

    @Delete(':platformId')
    @HttpCode(204)
    async delete(@Param('platformId') platformId: string): Promise<void> {
        await this.platformService.delete(platformId);
    }
    
}