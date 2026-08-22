import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class SafeHttpExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json(error.getResponse());
    }
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    const unavailable = code.startsWith('P1') || code === 'ECONNREFUSED';
    return response.status(unavailable ? 503 : 500).json({
      error: {
        code: unavailable ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR',
        message: unavailable ? 'Service unavailable' : 'Internal service error',
      },
    });
  }
}
