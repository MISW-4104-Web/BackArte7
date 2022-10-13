import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { DirectorEntity } from './director.entity';

@Injectable()
export class DirectorService {
    constructor(
        @InjectRepository(DirectorEntity)
        private readonly directorRepository: Repository<DirectorEntity>,
    ) { }

    async findAll(): Promise<DirectorEntity[]> {
        return await this.directorRepository.find({ relations: ['movies'] });
    }

    async findOne(id: string): Promise<DirectorEntity> {
        const director: DirectorEntity = await this.directorRepository.findOne({ where: { id }, relations: ['movies'] });
        if (!director)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        return director;
    }

    async create(director: DirectorEntity): Promise<DirectorEntity> {
        return await this.directorRepository.save(director);
    }

    async update(id: string, director: DirectorEntity): Promise<DirectorEntity> {
        const directorToUpdate: DirectorEntity = await this.directorRepository.findOne({ where: { id } });
        if (!directorToUpdate)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        return await this.directorRepository.save({ ...directorToUpdate, ...director });
    }

    async delete(id: string): Promise<void> {
        const directorToDelete: DirectorEntity = await this.directorRepository.findOne({ where: { id } });
        if (!directorToDelete)
            throw new BusinessLogicException("The director with the given id was not found", BusinessError.NOT_FOUND);
        await this.directorRepository.remove(directorToDelete);
    }
}
