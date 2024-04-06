import { ValidationArguments } from 'class-validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

import { MAX_PAYLOAD_SIZE, MAX_PAYLOAD_LENGTH } from '@shared/constants';

interface IsRuleValueOptions {
  maxSize?: number;
  maxLength?: number;
}

export const IsRuleValue = (options: IsRuleValueOptions = {}, validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options.maxLength ?? MAX_PAYLOAD_LENGTH, options.maxSize ?? MAX_PAYLOAD_SIZE],
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (Array.isArray(value)) {
            args.object['kind'] = 'multi';
            const [maxLength, maxSize] = args.constraints;
            const size = Buffer.from(JSON.stringify(value)).length;
            return value.length > 0 && value.length <= maxLength && size <= maxSize && value.every(isValidRule);
          } else {
            args.object['kind'] = 'single';
            return isValidRule(value);
          }
        },
        defaultMessage(args: ValidationArguments) {
          const [maxLength, maxSize] = args.constraints;
          return args.object['kind'] === 'single'
            ? `must be a valid object`
            : `must be an array of 1-${maxLength} objects (or <= ${maxSize} bytes)`;
        },
      },
    });
  };
};

export const isNonNullObject = (obj: unknown) => typeof obj === 'object' && obj !== null;

/**
 * Whether the given object has no keys.
 * Inspired by: https://stackoverflow.com/a/34491287
 */
export const isEmptyObject = (obj: object | null | undefined): boolean => {
  if (!obj) return true;
  for (const _k in obj) return false;
  return true;
};

const isValidRule = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  if (isEmptyObject(value)) return false;

  for (const key in value) {
    if (typeof value[key] !== 'string') return false;
  }
  return true;
};
