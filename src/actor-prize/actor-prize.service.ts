import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ActorEntity } from '../actor/actor.entity';
import { PrizeEntity } from '../prize/prize.entity';

@Injectable()
export class ActorPrizeService {
    constructor(
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
    ) { }

    async addPrizeToActor(actorId: string, prizeId: string): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['prizes'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        actor.prizes = [...actor.prizes, prize];
        return await this.actorRepository.save(actor);
    }

    async findPrizesFromActor(actorId: string): Promise<PrizeEntity[]> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['prizes'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        return actor.prizes;
    }

    async findPrizeFromActor(actorId: string, prizeId: string): Promise<PrizeEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['prizes'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = actor.prizes.find(prize => prize.id === prizeId);
        if (!prize)
            throw new BusinessLogicException("The prize with the given id is not associated to the actor", BusinessError.PRECONDITION_FAILED);

        return prize;
    }

    async updatePrizesFromActor(actorId: string, prizes: PrizeEntity[]): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['prizes'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);

        for (const prize of prizes) {
            const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prize.id } });
            if (!persistedPrize)
                throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        }

        actor.prizes = prizes;
        return await this.actorRepository.save(actor);
    }

    async deletePrizeFromActor(actorId: string, prizeId: string): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id: actorId }, relations: ['prizes'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prizeIndex: number = actor.prizes.findIndex(pr => pr.id === prizeId);
        if (prizeIndex === -1)
            throw new BusinessLogicException("The prize with the given id is not associated to the actor", BusinessError.PRECONDITION_FAILED);

        actor.prizes.splice(prizeIndex, 1);
        return await this.actorRepository.save(actor);
    }
}
