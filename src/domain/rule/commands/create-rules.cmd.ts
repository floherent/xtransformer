import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from 'typescript-result';

import { CreateRulesDto, IRuleRepo, RuleCreated } from '@domain/rule';

export class CreateRulesCommand {
  constructor(readonly dto: CreateRulesDto) {}
}

@CommandHandler(CreateRulesCommand)
export class CreateRulesCommandHandler implements ICommandHandler<CreateRulesCommand, Result<Error, RuleCreated[]>> {
  constructor(@Inject('IRuleRepo') private readonly ruleRepo: IRuleRepo) {}

  async execute(cmd: CreateRulesCommand): Promise<Result<Error, RuleCreated[]>> {
    return Result.safe(async () => await this.ruleRepo.create(cmd.dto));
  }
}
