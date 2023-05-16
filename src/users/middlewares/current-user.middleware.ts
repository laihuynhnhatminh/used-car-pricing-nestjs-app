import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
    constructor(
        private usersService: UsersService
    ) {}
    
    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { userId } = req.session || {};
        if (userId) {
            const user = (await this.usersService.findOne(userId))[0];
            req.currentUser = user;
        }

        next();
    }
}