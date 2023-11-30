import {ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {User} from "../../users/models/user.model";

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

    @IsNumber({}, { each: true })
    @IsOptional()
    user?: User
}