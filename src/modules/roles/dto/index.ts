import {IsString} from "class-validator";

export class RoleDTO {
    @IsString()
    value: string
}