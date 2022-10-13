import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class ReviewDto {
    @IsString()
    @IsNotEmpty()
    readonly text: string;

    @IsNumber()
    @IsNotEmpty()
    readonly score: number;

    @IsString()
    @IsNotEmpty()
    readonly creator: string;
}