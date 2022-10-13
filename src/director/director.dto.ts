import { IsNotEmpty, IsString, IsDateString, IsUrl } from 'class-validator';
export class DirectorDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsNotEmpty()
    readonly photo: string;

    @IsString()
    @IsNotEmpty()
    readonly nationality: string;

    @IsDateString()
    @IsNotEmpty()
    readonly birthDate: Date;

    @IsString()
    @IsNotEmpty()
    readonly biography: string;
}