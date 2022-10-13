import { IsNotEmpty, IsString } from 'class-validator';
export class GenreDto {
    @IsString()
    @IsNotEmpty()
    readonly type: string;
}