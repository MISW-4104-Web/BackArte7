import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { GenreEntity } from './genre.entity';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(GenreEntity)
        private readonly genreRepository: Repository<GenreEntity>,
    ) { }

    async findAll(): Promise<GenreEntity[]> {
        return await this.genreRepository.find({ relations: ['movies'] });
    }

    async findOne(id: string): Promise<GenreEntity> {
        const genre: GenreEntity = await this.genreRepository.findOne({ where: { id }, relations: ['movies'] });
        if (!genre)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
        return genre;
    }

    async create(genre: GenreEntity): Promise<GenreEntity> {
        return await this.genreRepository.save(genre);
    }

    async update(id: string, genre: GenreEntity): Promise<GenreEntity> {
        const genreToUpdate: GenreEntity = await this.genreRepository.findOne({ where: { id } });
        if (!genreToUpdate)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
        return await this.genreRepository.save({ ...genreToUpdate, ...genre });
    }

    async delete(id: string): Promise<void> {
        const genreToDelete: GenreEntity = await this.genreRepository.findOne({ where: { id } });
        if (!genreToDelete)
            throw new BusinessLogicException("The genre with the given id was not found", BusinessError.NOT_FOUND);
        await this.genreRepository.remove(genreToDelete);
    }
}
