import { IsObject } from 'class-validator';

import { JsonValue } from '@shared/utils';

export class EvaluateRulesDto {
  @IsObject()
  readonly data: JsonValue;
}
