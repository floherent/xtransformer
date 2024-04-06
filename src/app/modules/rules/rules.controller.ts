import { Logger, HttpStatus } from '@nestjs/common';
import { Controller, Post, Body, Param, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Result } from 'typescript-result';
import { Response } from 'express';

import { CreateRulesDto, EvaluateRulesDto, RuleEvaluated, RuleCreated } from '@domain/rule';
import { CreateRulesCommand, EvaluateRulesCommand } from '@domain/rule';

@ApiTags('rules')
@Controller({ path: 'rules', version: '1' })
export class RulesController {
  private readonly logger = new Logger(RulesController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createRules(@Res() response: Response, @Body() body: CreateRulesDto) {
    const command = new CreateRulesCommand(body);
    const result = await this.commandBus.execute<CreateRulesCommand, Result<Error, RuleCreated[]>>(command);
    const payload = result.getOrThrow();

    this.logger.log(`rules have been created`);
    response.status(HttpStatus.CREATED).send(payload);
  }

  @Post(':id/evaluate')
  async evaluateRules(@Res() response: Response, @Param('id') id: string, @Body() body: EvaluateRulesDto) {
    const command = new EvaluateRulesCommand(id, body);
    const result = await this.commandBus.execute<EvaluateRulesCommand, Result<Error, RuleEvaluated>>(command);
    const payload = result.getOrThrow();

    response.status(HttpStatus.OK).send(payload);
  }
}
