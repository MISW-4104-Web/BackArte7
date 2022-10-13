import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { YoutubeTrailerEntity } from './youtube-trailer.entity';

@Injectable()
export class YoutubeTrailerService {
    constructor(
        @InjectRepository(YoutubeTrailerEntity)
        private readonly youtubeTrailerRepository: Repository<YoutubeTrailerEntity>,
    ) { }

    async findAll(): Promise<YoutubeTrailerEntity[]> {
        return await this.youtubeTrailerRepository.find({ relations: ['movie'] });
    }

    async findOne(id: string): Promise<YoutubeTrailerEntity> {
        const youtubeTrailer: YoutubeTrailerEntity = await this.youtubeTrailerRepository.findOne({ where: { id }, relations: ['movie'] });
        if (!youtubeTrailer)
            throw new BusinessLogicException("The youtube trailer with the given id was not found", BusinessError.NOT_FOUND);
        return youtubeTrailer;
    }

    async create(youtubeTrailer: YoutubeTrailerEntity): Promise<YoutubeTrailerEntity> {
        return await this.youtubeTrailerRepository.save(youtubeTrailer);
    }

    async update(id: string, youtubeTrailer: YoutubeTrailerEntity): Promise<YoutubeTrailerEntity> {
        const youtubeTrailerToUpdate: YoutubeTrailerEntity = await this.youtubeTrailerRepository.findOne({ where: { id } });
        if (!youtubeTrailerToUpdate)
            throw new BusinessLogicException("The youtube trailer with the given id was not found", BusinessError.NOT_FOUND);
        return await this.youtubeTrailerRepository.save({ ...youtubeTrailerToUpdate, ...youtubeTrailer });
    }

    async delete(id: string): Promise<void> {
        const youtubeTrailerToDelete: YoutubeTrailerEntity = await this.youtubeTrailerRepository.findOne({ where: { id } });
        if (!youtubeTrailerToDelete)
            throw new BusinessLogicException("The youtube trailer with the given id was not found", BusinessError.NOT_FOUND);
        await this.youtubeTrailerRepository.remove(youtubeTrailerToDelete);
    }
}
