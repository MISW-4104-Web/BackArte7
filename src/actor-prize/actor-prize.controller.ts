import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrizeDto } from '../prize/prize.dto';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorEntity } from '../actor/actor.entity';
import { ActorPrizeService } from './actor-prize.service';

@Controller('actors/:actorId/prizes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActorPrizeController {
    constructor(private readonly actorPrizeService: ActorPrizeService) { }

    @Get()
    async findPrizesFromActor(@Param('actorId') actorId: string): Promise<PrizeEntity[]> {
        return await this.actorPrizeService.findPrizesFromActor(actorId);
    }

    @Get(':prizeId')
    async findOne(@Param('actorId') actorId: string, @Param('prizeId') prizeId: string): Promise<PrizeEntity> {
        return await this.actorPrizeService.findPrizeFromActor(actorId, prizeId);
    }

    @Post(':prizeId')
    async addPrizeToActor(@Param('actorId') actorId: string, @Param('prizeId') prizeId: string): Promise<ActorEntity> {
        return await this.actorPrizeService.addPrizeToActor(actorId, prizeId);
    }

    @Put()
    async updatePrizesFromActor(@Param('actorId') actorId: string, @Body() prizesDto: PrizeDto[]): Promise<ActorEntity> {
        return await this.actorPrizeService.updatePrizesFromActor(actorId, plainToInstance(PrizeEntity, prizesDto));
    }

    @Delete(':prizeId')
    @HttpCode(204)
    async delete(@Param('actorId') actorId: string, @Param('prizeId') prizeId: string): Promise<void> {
        await this.actorPrizeService.deletePrizeFromActor(actorId, prizeId);
    }
}
