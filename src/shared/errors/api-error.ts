import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiError {
  status: number;
  message: string;
  cause?: unknown | Error;
}

export class ApiException extends HttpException {
  constructor(status?: number, message?: string, cause?: unknown | Error) {
    status ??= HttpStatus.UNPROCESSABLE_ENTITY;
    message ??= 'unable to fully process request';
    super({ status, message, cause }, status);
  }
}

export class RecordsNotFound extends ApiException {
  constructor(id: string, cause?: Error) {
    super(HttpStatus.NOT_FOUND, `no records found for id <${id}>`, cause);
  }
}

export class RuleCreationNotSaved extends ApiException {
  constructor(message?: string, cause?: Error) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message ?? `failed to create rules`, cause);
  }
}

export class RateLimitExceeded extends ApiException {
  constructor(message = 'rate limit exceeded', cause?: Error) {
    super(HttpStatus.TOO_MANY_REQUESTS, message, cause);
  }
}
