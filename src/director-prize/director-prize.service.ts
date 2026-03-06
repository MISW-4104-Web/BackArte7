import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { DirectorEntity } from '../director/director.entity';
import { PrizeEntity } from '../prize/prize.entity';

@Injectable()
export class DirectorPrizeService {
    constructor(
        @InjectRepository(DirectorEntity)
        private readonly directorRepository: Repository<DirectorEntity>,
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
    ) { }

    async addPrizeToDirector(directorId: string, prizeId: string): Promise<DirectorEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['prizes'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        director.prizes = [...director.prizes, prize];
        return await this.directorRepository.save(director);
    }

    async findPrizesFromDirector(directorId: string): Promise<PrizeEntity[]> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['prizes'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        return director.prizes;
    }

    async findPrizeFromDirector(directorId: string, prizeId: string): Promise<PrizeEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['prizes'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prize: PrizeEntity = director.prizes.find(pr => pr.id === prizeId);
        if (!prize)
            throw new BusinessLogicException("The prize with the given id is not associated to the director", BusinessError.PRECONDITION_FAILED);

        return prize;
    }

    async updatePrizesFromDirector(directorId: string, prizes: PrizeEntity[]): Promise<DirectorEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['prizes'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        for (const prize of prizes) {
            const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prize.id } });
            if (!persistedPrize)
                throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        }

        director.prizes = prizes;
        return await this.directorRepository.save(director);
    }

    async deletePrizeFromDirector(directorId: string, prizeId: string): Promise<DirectorEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId }, relations: ['prizes'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const persistedPrize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!persistedPrize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const prizeIndex: number = director.prizes.findIndex(pr => pr.id === prizeId);
        if (prizeIndex === -1)
            throw new BusinessLogicException("The prize with the given id is not associated to the director", BusinessError.PRECONDITION_FAILED);

        director.prizes.splice(prizeIndex, 1);
        return await this.directorRepository.save(director);
    }
}
