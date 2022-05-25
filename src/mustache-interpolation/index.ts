declare const _brand: unique symbol;
type Brand<Type, Name = "DefaultName"> = Type & { [_brand]: Name };
type ParserError<T extends string> = Brand<T, "ParserError">;

type ExtractVars<
  Str extends string,
  Vars extends string[] = []
> = Str extends `{{${infer Var}}}${infer Rest}`
  ? ExtractVars<Rest, [...Vars, Var]>
  : Str extends `${infer _0}{{${infer Var}}}${infer Rest}`
  ? ExtractVars<Rest, [...Vars, Var]>
  : Str extends `${infer Rest}{{${infer Var}}}`
  ? ExtractVars<Rest, [...Vars, Var]>
  : Vars;

type VarRecord<Str extends string> = {
  [K in ExtractVars<Str>[number]]: string;
};

type GetMissingVars<
  Str extends string,
  Obj extends Record<string, string>
> = ExtractVars<Str> extends infer Vars
  ? Vars extends string[]
    ? {
        [K in Vars[number]]: unknown extends Obj[K]
          ? `Missing var '${K}'`
          : never;
      }[Vars[number]]
    : never
  : never;

type Interpolate<
  Str extends string,
  Obj extends VarRecord<Str>
> = GetMissingVars<Str, Obj> extends infer MissingVars
  ? [MissingVars] extends [never]
    ? Str extends `${infer Prev}{{${infer Prop}}}${infer Rest}`
      ? `${Prev}${Obj[Prop & keyof Obj]}${Interpolate<Rest, Obj>}`
      : Str
    : ParserError<Extract<MissingVars, string>>
  : never;

type MyString = Interpolate<
  `My Name Is {{name}}, I'm {{age}} years old`,
  { name: "Anurag"; age: "19" }
>;

type DoesNotExists = Interpolate<
  `My Name Is {{name}}, I'm {{wow_look_at_me}} years old`,
  // @ts-expect-error
  { name: "Anurag"; age: "19" }
>;

export {};
