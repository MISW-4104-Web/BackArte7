import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { DirectorDto } from '../director/director.dto';
import { DirectorEntity } from '../director/director.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { PrizeDirectorService } from './prize-director.service';

@Controller('prizes/:prizeId/directors')
@UseInterceptors(BusinessErrorsInterceptor)
export class PrizeDirectorController {
    constructor(private readonly prizeDirectorService: PrizeDirectorService) { }

    @Get()
    async findDirectorsFromPrize(@Param('prizeId') prizeId: string): Promise<DirectorEntity[]> {
        return await this.prizeDirectorService.findDirectorsFromPrize(prizeId);
    }

    @Get(':directorId')
    async findOne(@Param('prizeId') prizeId: string, @Param('directorId') directorId: string): Promise<DirectorEntity> {
        return await this.prizeDirectorService.findDirectorFromPrize(prizeId, directorId);
    }

    @Post(':directorId')
    async addDirectorToPrize(@Param('prizeId') prizeId: string, @Param('directorId') directorId: string): Promise<PrizeEntity> {
        return await this.prizeDirectorService.addDirectorToPrize(prizeId, directorId);
    }

    @Put()
    async updateDirectorsFromPrize(@Param('prizeId') prizeId: string, @Body() directorsDto: DirectorDto[]): Promise<PrizeEntity> {
        return await this.prizeDirectorService.updateDirectorsFromPrize(prizeId, plainToInstance(DirectorEntity, directorsDto));
    }

    @Delete(':directorId')
    @HttpCode(204)
    async delete(@Param('prizeId') prizeId: string, @Param('directorId') directorId: string): Promise<void> {
        await this.prizeDirectorService.deleteDirectorFromPrize(prizeId, directorId);
    }
}
