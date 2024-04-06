export type RuleValue = Record<string, string>;

export type JsonData = null | boolean | number | string | JsonArray | JsonValue;

export type JsonArray = readonly JsonData[];

export type JsonValue = { readonly [key: string]: JsonData | undefined };
