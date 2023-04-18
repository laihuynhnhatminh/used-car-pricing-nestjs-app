import { NestInterceptor, ExecutionContext, CallHandler, Injectable} from '@nestjs/common'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    public async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.usersService.findOne(parseInt(userId));
            request.currentUser = user;
        }

        return handler.handle();
    }
}