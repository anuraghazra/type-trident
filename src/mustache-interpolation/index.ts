declare const _brand: unique symbol;
type Brand<Type, Name = "DefaultName"> = Type & { [_brand]: Name };
type ParserError<T extends string> = Brand<T, "ParserError">;

type ParseVar<T> = T extends `${infer Name}:${infer Type}`
  ? { name: Name; type: Type }
  : { name: T; type: "string" };

export type ExtractVars<T extends string> =
  T extends `${string}{{${infer Prop}}}${infer Rest}`
    ? ParseVar<Prop> | ExtractVars<Rest>
    : never;

type ToType<T> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : never;

type VarRecord<
  Str extends string,
  Ev extends ExtractVars<any> = ExtractVars<Str>
> = {
  [K in Ev["name"]]: ToType<Extract<Ev, { name: K }>["type"]>;
};

type GetMissingVars<
  Str extends string,
  Obj extends Record<string, string>
> = ExtractVars<Str>["name"] extends infer Vars
  ? Vars extends string
    ? {
        [K in Vars]: unknown extends Obj[K] ? `Missing var '${K}'` : never;
      }[Vars]
    : never
  : never;

type Interpolate<
  Str extends string,
  Obj extends VarRecord<Str>
> = GetMissingVars<Str, Obj> extends infer MissingVars
  ? [MissingVars] extends [never]
    ? Str extends `${infer Prev}{{${infer Prop}}}${infer Rest}`
      ? `${Prev}${Obj[ParseVar<Prop>["name"] & keyof Obj]}${Interpolate<
          Rest,
          Obj & VarRecord<Rest>
        >}`
      : Str
    : ParserError<Extract<MissingVars, string>>
  : never;

type Demo = Interpolate<
  `My Name Is {{name:string}}, I'm {{age:number}} years old`,
  { name: "Anurag"; age: 22 }
>;

type DoesNotExists = Interpolate<
  `My Name Is {{name}}, I'm {{wow_look_at_me}} years old`,
  // @ts-expect-error
  { name: "Anurag"; age: "19" }
>;

export {};
