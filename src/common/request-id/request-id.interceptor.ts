import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestIdProvider } from './request-id.provider';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdInterceptor implements NestInterceptor {
  constructor(private readonly reqId: RequestIdProvider) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    response.setHeader('x-request-id', this.reqId.getId());
    return next.handle().pipe(
      tap(() => {
        // no-op, header already set
      }),
    );
  }
}


