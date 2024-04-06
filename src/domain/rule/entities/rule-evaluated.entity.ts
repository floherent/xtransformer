export class RuleEvaluated {
  constructor(readonly rule_id: string, readonly result: Record<string, any>, readonly warnings: any[]) {}
}
