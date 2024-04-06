import { RuleCreated } from '@domain/rule';

export class CreateRuleModel {
  constructor(
    readonly rule_id: string,
    readonly file_path: string,
    readonly total_rules: number,
    readonly created_at: Date,
  ) {}
}

export interface RuleCreatedModel {
  rule_id: string;
  file_path: string;
  total_rules: string;
  created_at: string;
}

export class CreateRuleModelHandler extends CreateRuleModel {
  get asDto(): RuleCreated {
    return new RuleCreated(this.rule_id, this.file_path, this.total_rules, this.created_at.toISOString());
  }

  constructor(fields: { rule_id: string; file_path: string; total_rules: number; created_at: Date }) {
    super(fields.rule_id, fields.file_path, +fields.total_rules, fields.created_at);
  }

  toCsv(sep?: string): string {
    return [this.rule_id, this.file_path, this.total_rules.toString(), this.created_at.toISOString()].join(sep ?? ',');
  }

  static headers(sep?: string): string {
    return ['rule_id', 'file_path', 'total_rules', 'created_at'].join(sep ?? ',');
  }
}
