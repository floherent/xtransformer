export * from './dtos/create-rules.dto';
export * from './dtos/evaluate-rules.dto';

export * from './entities/rule-created.entity';
export * from './entities/rule-evaluated.entity';

export * from './commands/create-rules.cmd';
export * from './commands/evaluate-rules.cmd';

export * from './repos/rule.repo';

import { CreateRulesCommandHandler } from './commands/create-rules.cmd';
import { EvaluateRulesCommandHandler } from './commands/evaluate-rules.cmd';

export const CqrsHandlers = [CreateRulesCommandHandler, EvaluateRulesCommandHandler];
