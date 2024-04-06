import { IsOptional, IsString } from 'class-validator';

import { IsRuleValue, RuleValue } from '@shared/utils';

export class CreateRulesDto {
  @IsRuleValue()
  rules: RuleValue | RuleValue[];

  @IsString()
  @IsOptional()
  kind: 'single' | 'multi';
}
