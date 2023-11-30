import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CategoryDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    @IsNotEmpty({ each: true })
    @IsOptional()
    productIds?: number[] | string[];
}