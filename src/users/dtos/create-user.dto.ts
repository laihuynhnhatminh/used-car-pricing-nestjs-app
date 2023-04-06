import { IsString, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}