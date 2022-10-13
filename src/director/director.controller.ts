import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { DirectorDto } from './director.dto';
import { DirectorEntity } from './director.entity';
import { DirectorService } from './director.service';

@Controller('directors')
@UseInterceptors(BusinessErrorsInterceptor)
export class DirectorController {
    constructor(private readonly directorService: DirectorService) { }

    @Get()
    async findAll(): Promise<DirectorEntity[]> {
        return await this.directorService.findAll();
    }

    @Get(':directorId')
    async findOne(@Param('directorId') directorId: string): Promise<DirectorEntity> {
        return await this.directorService.findOne(directorId);
    }

    @Post()
    async create(@Body() directorDto: DirectorDto): Promise<DirectorEntity> {
        return await this.directorService.create(plainToInstance(DirectorEntity, directorDto));
    }

    @Put(':directorId')
    async update(@Param('directorId') directorId: string, @Body() directorDto: DirectorDto): Promise<DirectorEntity> {
        return await this.directorService.update(directorId, plainToInstance(DirectorEntity, directorDto));
    }

    @Delete(':directorId')
    @HttpCode(204)
    async delete(@Param('directorId') directorId: string): Promise<void> {
        await this.directorService.delete(directorId);
    }

}