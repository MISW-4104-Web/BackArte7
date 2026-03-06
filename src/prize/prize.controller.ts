import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrizeDto } from './prize.dto';
import { PrizeEntity } from './prize.entity';
import { PrizeService } from './prize.service';

@Controller('prizes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PrizeController {
    constructor(private readonly prizeService: PrizeService) { }

    @Get()
    async findAll(): Promise<PrizeEntity[]> {
        return await this.prizeService.findAll();
    }

    @Get(':prizeId')
    async findOne(@Param('prizeId') prizeId: string): Promise<PrizeEntity> {
        return await this.prizeService.findOne(prizeId);
    }

    @Post()
    async create(@Body() prizeDto: PrizeDto): Promise<PrizeEntity> {
        return await this.prizeService.create(plainToInstance(PrizeEntity, prizeDto));
    }

    @Put(':prizeId')
    async update(@Param('prizeId') prizeId: string, @Body() prizeDto: PrizeDto): Promise<PrizeEntity> {
        return await this.prizeService.update(prizeId, plainToInstance(PrizeEntity, prizeDto));
    }

    @Delete(':prizeId')
    @HttpCode(204)
    async delete(@Param('prizeId') prizeId: string): Promise<void> {
        await this.prizeService.delete(prizeId);
    }
}
