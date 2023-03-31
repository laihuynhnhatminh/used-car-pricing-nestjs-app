import { IsString, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    private email: string;

    @IsString()
    private password: string;
}