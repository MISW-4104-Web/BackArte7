import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PrizeEntity } from '../prize/prize.entity';
import { DirectorEntity } from '../director/director.entity';

@Injectable()
export class PrizeDirectorService {
    constructor(
        @InjectRepository(PrizeEntity)
        private readonly prizeRepository: Repository<PrizeEntity>,
        @InjectRepository(DirectorEntity)
        private readonly directorRepository: Repository<DirectorEntity>,
    ) { }

    async addDirectorToPrize(prizeId: string, directorId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['directors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId } });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);

        prize.directors = [...prize.directors, director];
        return await this.prizeRepository.save(prize);
    }

    async findDirectorsFromPrize(prizeId: string): Promise<DirectorEntity[]> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['directors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        return prize.directors;
    }

    async findDirectorFromPrize(prizeId: string, directorId: string): Promise<DirectorEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['directors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedDirector: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId } });
        if (!persistedDirector)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const director: DirectorEntity = prize.directors.find(d => d.id === directorId);
        if (!director)
            throw new BusinessLogicException("The director with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        return director;
    }

    async updateDirectorsFromPrize(prizeId: string, directors: DirectorEntity[]): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['directors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);

        for (const director of directors) {
            const persistedDirector: DirectorEntity = await this.directorRepository.findOne({ where: { id: director.id } });
            if (!persistedDirector)
                throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        }

        prize.directors = directors;
        return await this.prizeRepository.save(prize);
    }

    async deleteDirectorFromPrize(prizeId: string, directorId: string): Promise<PrizeEntity> {
        const prize: PrizeEntity = await this.prizeRepository.findOne({ where: { id: prizeId }, relations: ['directors'] });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND);
        const persistedDirector: DirectorEntity = await this.directorRepository.findOne({ where: { id: directorId } });
        if (!persistedDirector)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        const directorIndex: number = prize.directors.findIndex(d => d.id === directorId);
        if (directorIndex === -1)
            throw new BusinessLogicException("The director with the given id is not associated to the prize", BusinessError.PRECONDITION_FAILED);

        prize.directors.splice(directorIndex, 1);
        return await this.prizeRepository.save(prize);
    }
}
