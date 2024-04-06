import { ApiError } from '@shared/errors';

export type Swagger = typeof import('@nestjs/swagger');

export interface EndpointOptions {
  /**
   * Whether to document the endpoint with Swagger or not.
   *
   * @default true
   */
  swaggerDocs?: boolean;
}

/**
 * Attempts to load the `@nestjs/swagger` module.
 * @returns the `@nestjs/swagger` module if installed, `null` otherwise.
 */
export function getSwaggerModule(): Swagger | null {
  let swagger: Swagger | null = null;
  try {
    swagger = require('@nestjs/swagger');
  } catch {
    swagger = null;
  }
  return swagger;
}

export function getErrorSchema({ status, message, cause }: ApiError) {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      error: {
        type: 'object',
        required: ['status', 'message'],
        additionalProperties: false,
        properties: {
          status: {
            type: 'number',
            description: 'HTTP status code',
            example: status,
          },
          message: {
            type: 'string',
            description: 'message describing the failure',
            example: message,
          },
          cause: {
            type: 'object',
            description: 'description of the failure if any',
            example: cause ?? null,
            oneOf: [
              { type: 'object' },
              {
                type: 'array',
                items: { type: 'string' },
              },
              { type: 'string' },
              { type: 'null' },
            ],
          },
        },
      },
    },
  };
}
