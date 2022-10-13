import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class PlatformDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsNotEmpty()
    readonly url: string;
}