import { Injectable } from '@nestjs/common';
import { existsSync, appendFileSync, readFileSync, createWriteStream } from 'fs';
import { parse as csvParse } from 'papaparse';
import * as jsonata from 'jsonata';
import { join } from 'path';

import { AppConfig } from '@app/modules/config';
import { RuleCreationNotSaved, RecordsNotFound } from '@shared/errors';
import { CreateRulesDto, IRuleRepo, RuleCreated, Rule, RuleEvaluated, EvaluateRulesDto } from '@domain/rule';
import { CreateRuleModelHandler, RuleCreatedMapper, RuleCreatedModel } from '@infra/rule';

@Injectable()
export class RuleRepo implements IRuleRepo {
  constructor(private readonly appConfig: AppConfig, private readonly createRuleMapper: RuleCreatedMapper) {}

  async create(dto: CreateRulesDto): Promise<RuleCreated[]> {
    const { uploadPath } = this.appConfig.props.app;
    const path = join(uploadPath, BASE_PATH);
    const rules = Array.isArray(dto.rules) ? dto.rules : [dto.rules];

    try {
      const models = [];
      for (const rule of rules) {
        const ruleCreated = Rule.created(uploadPath, Object.keys(rule).length);
        models.push(this.createRuleMapper.toModel(ruleCreated));

        const writer = createWriteStream(ruleCreated.path);
        writer.write(JSON.stringify(rule));
        writer.end();
      }

      if (!existsSync(path)) appendFileSync(path, `${CreateRuleModelHandler.headers(',')}\n`);
      appendFileSync(path, models.map((m) => m.toCsv()).join('\n'));

      return models.map((m) => this.createRuleMapper.toEntity(m));
    } catch (cause) {
      throw new RuleCreationNotSaved();
    }
  }

  async evaluate(id: string, dto: EvaluateRulesDto): Promise<RuleEvaluated> {
    const path = join(this.appConfig.props.app.uploadPath, `${id}.json`);
    if (!existsSync(path)) throw new RecordsNotFound(id);

    const rule = JSON.parse(readFileSync(path, 'utf8')) as Record<string, string>;

    const evaluation = {};
    const warnings = [];
    for (const [key, value] of Object.entries(rule)) {
      let output = null;
      try {
        const expression = jsonata(value);
        output = await expression.evaluate(dto.data);
      } catch (cause) {
        output = null;
        warnings.push({ key, details: cause });
      }
      const json = buildJsonPath(key, output);
      Object.assign(evaluation, json);
    }

    return new RuleEvaluated(id, evaluation, warnings);
  }

  async findOne(ruleId: string): Promise<RuleCreated> {
    const path = join(this.appConfig.props.app.uploadPath, BASE_PATH);
    const data = this.loadRules(path);
    const model = data.find((m) => m.id === ruleId);
    if (!model) throw new RecordsNotFound(ruleId);

    return model;
  }

  private loadRules(filePath: string): RuleCreated[] {
    const url = join(process.cwd(), filePath);
    if (!existsSync(url)) return [];

    const parsed = csvParse<RuleCreatedModel>(readFileSync(url, 'utf8'), { header: true });
    if (parsed.errors.length > 0) return [];

    return parsed.data.map(
      (row) =>
        new CreateRuleModelHandler({
          ...row,
          created_at: new Date(row.created_at),
          total_rules: +row.total_rules,
        }).asDto,
    );
  }
}

function buildJsonPath(path: string, value: any): Record<string, any> {
  if (path.includes('.')) {
    const [key, ...rest] = path.split('.');
    return { [key]: buildJsonPath(rest.join('.'), value) };
  }

  return { [path]: value };
}

const BASE_PATH = 'rules.csv';
