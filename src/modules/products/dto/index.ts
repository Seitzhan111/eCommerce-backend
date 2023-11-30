import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class ProductDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    price: string

    @IsOptional()
    images?: string[]

    @IsBoolean()
    @IsOptional()
    sales?: boolean

    @IsNumber()
    @IsOptional()
    userId?: number[]

    @IsNumber()
    @IsOptional()
    categoryId?: number[]
}

export class ProductUpdateDTO {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description?: string

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    price?: string

    @IsOptional()
    images?: string[]

    @IsBoolean()
    @IsOptional()
    sales?: boolean

    @IsNumber()
    @IsOptional()
    categoryId?: number[]
}