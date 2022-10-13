import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PlatformEntity } from './platform.entity';

@Injectable()
export class PlatformService {
    constructor(
        @InjectRepository(PlatformEntity)
        private readonly platformRepository: Repository<PlatformEntity>,
    ) { }

    async findAll(): Promise<PlatformEntity[]> {
        return await this.platformRepository.find({ relations: ['movies'] });
    }

    async findOne(id: string): Promise<PlatformEntity> {
        const platform: PlatformEntity = await this.platformRepository.findOne({ where: { id }, relations: ['movies'] });
        if (!platform)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        return platform;
    }

    async create(platform: PlatformEntity): Promise<PlatformEntity> {
        return await this.platformRepository.save(platform);
    }

    async update(id: string, platform: PlatformEntity): Promise<PlatformEntity> {
        const platformToUpdate: PlatformEntity = await this.platformRepository.findOne({ where: { id } });
        if (!platformToUpdate)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        return await this.platformRepository.save({ ...platformToUpdate, ...platform });
    }

    async delete(id: string): Promise<void> {
        const platformToDelete: PlatformEntity = await this.platformRepository.findOne({ where: { id } });
        if (!platformToDelete)
            throw new BusinessLogicException("The platform with the given id was not found", BusinessError.NOT_FOUND);
        await this.platformRepository.remove(platformToDelete);
    }
}
