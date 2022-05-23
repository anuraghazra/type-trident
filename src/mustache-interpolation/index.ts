type ParserError<T extends string> = { error: true } & T;
type TrimWhiteSpace<Str extends string> = string extends Str
  ? "Error"
  : Str extends ` ${infer Str}` | `\n${infer Str}`
  ? TrimWhiteSpace<Str>
  : Str;

type StringContains<
  Input extends string,
  Term extends string
> = Input extends Term
  ? true
  : Input extends `{{${Term}}}${infer _}`
  ? true
  : Input extends `${infer _0}{{${Term}}}${infer _1}`
  ? true
  : Input extends `${infer _}{{${Term}}}`
  ? true
  : false;

type CheckTypes<Str extends string, Obj extends string> = string extends Str
  ? ParserError<"CheckTypes: parameter Str expected string">
  : Str extends `${infer _}{{${infer Var}}}${infer Rest}`
  ? TrimWhiteSpace<Var> extends Obj
    ? false extends StringContains<`${_}{{${Var}}}${Rest}`, TrimWhiteSpace<Var>>
      ? CheckTypes<`${_}${Rest}`, Exclude<Obj, TrimWhiteSpace<Var>>>
      : CheckTypes<`${_}${Rest}`, Obj>
    : Var
  : true;

type Interpolate<
  Str extends string,
  Obj extends Record<string, string>
> = string extends Str
  ? ParserError<"Interpolate: parameter Str expected string">
  : CheckTypes<Str, keyof Obj & string> extends `${infer VarNotFound}`
  ? ParserError<`var {{${VarNotFound}}} does not exists on the given object`>
  : Str extends `${infer Prev}{{${infer Prop}}}${infer Rest}`
  ? `${Prev}${Obj[Prop]}${Interpolate<Rest, Obj>}`
  : Str;

type MyString = Interpolate<
  `My Name Is {{name}}, I'm {{age}} years old`,
  { name: "Anurag"; age: "19" }
>;

type DoesNotExists = Interpolate<
  `My Name Is {{name}}, I'm {{wow_look_at_me}} years old`,
  { name: "Anurag"; age: "19" }
>;
