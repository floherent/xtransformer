import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';

import { AppConfigModule } from '@app/modules/config';
import { RuleCreatedMapper, RuleRepo } from '@infra/rule';
import { CqrsHandlers } from '@domain/rule';
import { RulesController } from './rules.controller';

@Module({
  imports: [AppConfigModule, CqrsModule, HttpModule],
  controllers: [RulesController],
  providers: [RuleCreatedMapper, ...CqrsHandlers, { provide: 'IRuleRepo', useClass: RuleRepo }],
})
export class RulesModule {}
