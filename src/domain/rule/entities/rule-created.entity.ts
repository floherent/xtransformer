import { v4 as uuid } from 'uuid';

export class RuleCreated {
  constructor(readonly id: string, readonly path: string, readonly total_rules: number, readonly created_at: string) {}
}

export class Rule {
  static created(basePath: string, size: number): RuleCreated {
    const id = uuid();
    return new RuleCreated(id, `${basePath}/${id}.json`, size, new Date().toISOString());
  }
}
