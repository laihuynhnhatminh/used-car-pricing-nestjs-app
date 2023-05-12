import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Getting current user data
 */
export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        return context.switchToHttp().getRequest().currentUser;
    }
)