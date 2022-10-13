import { IsNotEmpty, IsString, IsNumber, IsDateString, IsUrl } from 'class-validator';
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

    @IsDateString()
    @IsNotEmpty()
    readonly releaseDate: Date;

    @IsNumber()
    @IsNotEmpty()
    readonly popularity: number;
}