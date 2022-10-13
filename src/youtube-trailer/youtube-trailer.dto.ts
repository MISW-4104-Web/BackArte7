import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';
export class YoutubeTrailerDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsNotEmpty()
    readonly url: string;

    @IsNumber()
    @IsNotEmpty()
    readonly duration: number;

    @IsString()
    @IsNotEmpty()
    readonly channel: string;
}