import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errRes = exception.getResponse() as string | { message: string | string[] };
    if (errRes instanceof Object){
      if (typeof errRes.message === 'string') {
        errRes.message = [errRes.message]
      }
    }
    response
      .status(status || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        statusCode: status,
        path: request.url,
        message: typeof errRes === 'string' ? errRes.toString() : errRes.message.pop()
      });
  }
}
