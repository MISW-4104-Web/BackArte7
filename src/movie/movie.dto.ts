import {IsNotEmpty, IsString, IsNumber, IsDate, IsUrl} from 'class-validator';
export class MovieDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsUrl()
    @IsNotEmpty()
    readonly poster: string;

    @IsNumber()
    @IsNotEmpty()
    readonly duration: number;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsDate()
    @IsNotEmpty()
    readonly releaseDate: Date;

    @IsNumber()
    @IsNotEmpty()
    readonly popularity: number;
}