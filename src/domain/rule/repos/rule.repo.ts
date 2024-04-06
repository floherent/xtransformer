import { RuleCreated, RuleEvaluated } from '@domain/rule';
import { CreateRulesDto } from '../dtos/create-rules.dto';
import { EvaluateRulesDto } from '../dtos/evaluate-rules.dto';

export interface IRuleRepo {
  create: (dto: CreateRulesDto) => Promise<RuleCreated[]>;
  evaluate: (id: string, dto: EvaluateRulesDto) => Promise<RuleEvaluated>;
}
