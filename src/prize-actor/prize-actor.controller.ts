import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ActorDto } from '../actor/actor.dto';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeEntity } from '../prize/prize.entity';
import { PrizeActorService } from './prize-actor.service';

@Controller('prizes/:prizeId/actors')
@UseInterceptors(BusinessErrorsInterceptor)
export class PrizeActorController {
    constructor(private readonly prizeActorService: PrizeActorService) { }

    @Get()
    async findActorsFromPrize(@Param('prizeId') prizeId: string): Promise<ActorEntity[]> {
        return await this.prizeActorService.findActorsFromPrize(prizeId);
    }

    @Get(':actorId')
    async findOne(@Param('prizeId') prizeId: string, @Param('actorId') actorId: string): Promise<ActorEntity> {
        return await this.prizeActorService.findActorFromPrize(prizeId, actorId);
    }

    @Post(':actorId')
    async addActorToPrize(@Param('prizeId') prizeId: string, @Param('actorId') actorId: string): Promise<PrizeEntity> {
        return await this.prizeActorService.addActorToPrize(prizeId, actorId);
    }

    @Put()
    async updateActorsFromPrize(@Param('prizeId') prizeId: string, @Body() actorsDto: ActorDto[]): Promise<PrizeEntity> {
        return await this.prizeActorService.updateActorsFromPrize(prizeId, plainToInstance(ActorEntity, actorsDto));
    }

    @Delete(':actorId')
    @HttpCode(204)
    async delete(@Param('prizeId') prizeId: string, @Param('actorId') actorId: string): Promise<void> {
        await this.prizeActorService.deleteActorFromPrize(prizeId, actorId);
    }
}
