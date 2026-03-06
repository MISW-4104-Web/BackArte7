import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrizeDto } from '../prize/prize.dto';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorEntity } from '../director/director.entity';
import { DirectorPrizeService } from './director-prize.service';

@Controller('directors/:directorId/prizes')
@UseInterceptors(BusinessErrorsInterceptor)
export class DirectorPrizeController {
    constructor(private readonly directorPrizeService: DirectorPrizeService) { }

    @Get()
    async findPrizesFromDirector(@Param('directorId') directorId: string): Promise<PrizeEntity[]> {
        return await this.directorPrizeService.findPrizesFromDirector(directorId);
    }

    @Get(':prizeId')
    async findOne(@Param('directorId') directorId: string, @Param('prizeId') prizeId: string): Promise<PrizeEntity> {
        return await this.directorPrizeService.findPrizeFromDirector(directorId, prizeId);
    }

    @Post(':prizeId')
    async addPrizeToDirector(@Param('directorId') directorId: string, @Param('prizeId') prizeId: string): Promise<DirectorEntity> {
        return await this.directorPrizeService.addPrizeToDirector(directorId, prizeId);
    }

    @Put()
    async updatePrizesFromDirector(@Param('directorId') directorId: string, @Body() prizesDto: PrizeDto[]): Promise<DirectorEntity> {
        return await this.directorPrizeService.updatePrizesFromDirector(directorId, plainToInstance(PrizeEntity, prizesDto));
    }

    @Delete(':prizeId')
    @HttpCode(204)
    async delete(@Param('directorId') directorId: string, @Param('prizeId') prizeId: string): Promise<void> {
        await this.directorPrizeService.deletePrizeFromDirector(directorId, prizeId);
    }
}
