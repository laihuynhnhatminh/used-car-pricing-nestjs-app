import { Injectable } from "@nestjs/common";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    public async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length > 0) {
            throw new BadRequestException('Email is already in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');
        const hashedPassword = `${salt}.${hash}`;
        const user = await this.usersService.create(email, hashedPassword);

        return user;
    }

    public async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException();
        }
        const [salt, hashedPassword] = user.password.split('.');

        const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');
        if (hashedPassword !== hash) {
            throw new BadRequestException('Invalid password or email');
        }

        return user;
    }
}