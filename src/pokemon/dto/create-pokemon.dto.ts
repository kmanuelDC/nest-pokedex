import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreatePokemonDto {

    @IsNumber()
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    number: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
