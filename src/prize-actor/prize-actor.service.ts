import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PrizeEntity } from '../prize/prize.entity';
import { ActorEntity } from '../actor/actor.entity';

@Injectable()
export class PrizeActorService {
    constructor(
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
    ) { }

    async addActorToPrize(prizeId: string, actorId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        prize.actors = [...prize.actors, actor];
        return await this.prizeRepository.save(prize);
    }

    async findActorsFromPrize(prizeId: string): Promise<ActorEntity[]> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        return prize.actors;
    }

    async findActorFromPrize(prizeId: string, actorId: string): Promise<ActorEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!persistedActor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const actor: ActorEntity = prize.actors.find(actor => actor.id === actorId);
        if (!actor)
            throw new BusinessLogicException("The actor with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        return actor;
    }

    async updateActorsFromPrize(prizeId: string, actors: ActorEntity[]): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        for (const actor of actors) {
            const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actor.id } });
            if (!persistedActor)
                throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        }

        prize.actors = actors;
        return await this.prizeRepository.save(prize);
    }

    async deleteActorFromPrize(prizeId: string, actorId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedActor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId } });
        if (!persistedActor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const actorIndex: number = prize.actors.findIndex(actor => actor.id === actorId);
        if (actorIndex === -1)
            throw new BusinessLogicException("The actor with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        prize.actors.splice(actorIndex, 1);
        return await this.prizeRepository.save(prize);
    }
}
