import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ActorEntity } from './actor.entity';

@Injectable()
export class ActorService {
    constructor(
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
    ) { }

    async findAll(): Promise<ActorEntity[]> {
        return await this.actorRepository.find({ relations: ['movies'] });
    }

    async findOne(id: string): Promise<ActorEntity> {
        const actor: ActorEntity = await this.actorRepository.findOne({ where: { id }, relations: ['movies'] });
        if (!actor)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        return actor;
    }

    async create(actor: ActorEntity): Promise<ActorEntity> {
        return await this.actorRepository.save(actor);
    }

    async update(id: string, actor: ActorEntity): Promise<ActorEntity> {
        const actorToUpdate: ActorEntity = await this.actorRepository.findOne({ where: { id } });
        if (!actorToUpdate)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        return await this.actorRepository.save({ ...actorToUpdate, ...actor });
    }

    async delete(id: string): Promise<void> {
        const actorToDelete: ActorEntity = await this.actorRepository.findOne({ where: { id } });
        if (!actorToDelete)
            throw new BusinessLogicException("The actor with the given id was not found", BusinessError.NOT_FOUND);
        await this.actorRepository.remove(actorToDelete);
    }
}
