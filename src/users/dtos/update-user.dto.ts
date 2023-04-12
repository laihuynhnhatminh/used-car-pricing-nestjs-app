import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsEmail()
    @IsOptional()
    public email: string;

    @IsString()
    @IsOptional()
    public password: string;
}