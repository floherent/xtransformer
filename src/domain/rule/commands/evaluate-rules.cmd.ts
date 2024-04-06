import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from 'typescript-result';

import { EvaluateRulesDto, IRuleRepo, RuleEvaluated } from '@domain/rule';

export class EvaluateRulesCommand {
  constructor(readonly id: string, readonly dto: EvaluateRulesDto) {}
}

@CommandHandler(EvaluateRulesCommand)
export class EvaluateRulesCommandHandler
  implements ICommandHandler<EvaluateRulesCommand, Result<Error, RuleEvaluated>>
{
  constructor(@Inject('IRuleRepo') private readonly ruleRepo: IRuleRepo) {}

  async execute(cmd: EvaluateRulesCommand): Promise<Result<Error, RuleEvaluated>> {
    return Result.safe(async () => await this.ruleRepo.evaluate(cmd.id, cmd.dto));
  }
}
