import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PlatformDto } from './platform.dto';
import { PlatformEntity } from './platform.entity';
import { PlatformService } from './platform.service';

@Controller('platforms')
@UseInterceptors(BusinessErrorsInterceptor)
export class PlatformController {
    constructor(private readonly platformService: PlatformService) { }

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