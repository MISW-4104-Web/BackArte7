import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PrizeEntity } from './prize.entity';

@Injectable()
export class PrizeService {
    constructor(
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
    ) { }

    async findAll(): Promise<PrizeEntity[]> {
        return await this.prizeRepository.find({ relations: ['directors', 'movies', 'actors'] });
    }

    async findOne(id: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id }, relations: ['directors', 'movies', 'actors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        return prize;
    }

    async create(prize: PrizeEntity): Promise<PrizeEntity> {
        return await this.prizeRepository.save(prize);
    }

    async update(id: string, prize: PrizeEntity): Promise<PrizeEntity> {
        const prizeToUpdate: PrizeEntity = await this.prizeRepository.findOne({ where: { id } });
        if (!prizeToUpdate)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        return await this.prizeRepository.save({ ...prizeToUpdate, ...prize });
    }

    async delete(id: string): Promise<void> {
        const prizeToDelete: PrizeEntity = await this.prizeRepository.findOne({ where: { id } });
        if (!prizeToDelete)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        await this.prizeRepository.remove(prizeToDelete);
    }
}
