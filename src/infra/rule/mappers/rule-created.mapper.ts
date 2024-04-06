import { Injectable } from '@nestjs/common';

import { EntityModelMapper } from '@shared/mappers';
import { RuleCreated } from '@domain/rule';
import { CreateRuleModelHandler, CreateRuleModel } from '../models/create-rule.model';

@Injectable()
export class RuleCreatedMapper extends EntityModelMapper<RuleCreated, CreateRuleModelHandler> {
  toModel(from: RuleCreated): CreateRuleModelHandler {
    return new CreateRuleModelHandler({
      rule_id: from.id,
      file_path: from.path,
      total_rules: from.total_rules,
      created_at: new Date(from.created_at),
    });
  }

  toEntity(from: CreateRuleModel): RuleCreated {
    return new RuleCreated(from.rule_id, from.file_path, from.total_rules, from.created_at.toISOString());
  }
}
