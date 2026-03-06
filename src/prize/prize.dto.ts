import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export class PrizeDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly category: string;

    @IsNumber()
    @IsNotEmpty()
    readonly year: number;

    @IsString()
    @IsNotEmpty()
    @IsIn(['won', 'nominated'])
    readonly status: string;
}
