import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { YoutubeTrailerDto } from './youtube-trailer.dto';
import { YoutubeTrailerEntity } from './youtube-trailer.entity';
import { YoutubeTrailerService } from './youtube-trailer.service';

@Controller('youtube-trailers')
@UseInterceptors(BusinessErrorsInterceptor)
export class YoutubeTrailerController {
    constructor(private readonly youtubeTrailerService: YoutubeTrailerService) { }

    @Get()
    async findAll(): Promise<YoutubeTrailerEntity[]> {
        return await this.youtubeTrailerService.findAll();
    }

    @Get(':youtubeTrailerId')
    async findOne(@Param('youtubeTrailerId') youtubeTrailerId: string): Promise<YoutubeTrailerEntity> {
        return await this.youtubeTrailerService.findOne(youtubeTrailerId);
    }

    @Post()
    async create(@Body() youtubeTrailerDto: YoutubeTrailerDto): Promise<YoutubeTrailerEntity> {
        return await this.youtubeTrailerService.create(plainToInstance(YoutubeTrailerEntity, youtubeTrailerDto));
    }

    @Put(':youtubeTrailerId')
    async update(@Param('youtubeTrailerId') youtubeTrailerId: string, @Body() youtubeTrailerDto: YoutubeTrailerDto): Promise<YoutubeTrailerEntity> {
        return await this.youtubeTrailerService.update(youtubeTrailerId, plainToInstance(YoutubeTrailerEntity, youtubeTrailerDto));
    }

    @Delete(':youtubeTrailerId')
    @HttpCode(204)
    async delete(@Param('youtubeTrailerId') youtubeTrailerId: string): Promise<void> {
        await this.youtubeTrailerService.delete(youtubeTrailerId);
    }

}