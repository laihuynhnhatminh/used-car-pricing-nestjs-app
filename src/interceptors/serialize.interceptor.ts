import { ExecutionContext, NestInterceptor, CallHandler } from "@nestjs/common";
import { UseInterceptors } from "@nestjs/common/decorators/core/use-interceptors.decorator";
import { ClassConstructor, plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";

export function Serialize(dto: ClassConstructor<any>): MethodDecorator & ClassDecorator {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dtos: ClassConstructor<any>) {}
    public intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dtos, data, {
                    excludeExtraneousValues: true
                })
            }
        ))
    }
}