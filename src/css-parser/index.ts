type TrimWhiteSpace<Str extends string> = string extends Str
  ? "Error"
  : Str extends ` ${infer Str}` | `\n${infer Str}`
  ? TrimWhiteSpace<Str>
  : Str;

type GetType<Str extends string> = string extends Str
  ? "Error"
  : Str extends `${infer Value}px`
  ? number
  : string;

// "font-size" -> "fontSize"
// "grid-column-start" -> "gridColumnStart"
type KebabCaseToCamelCase<Str extends string> = string extends Str
  ? "Error"
  : Str extends `${infer Part1}-${infer Part2}`
  ? `${Part1}${Capitalize<KebabCaseToCamelCase<Part2>>}`
  : Str;

type ParseCSSProps<S extends string> =
  S extends `${infer Prop}:${infer Value};${infer Rest}`
    ? {
        [k in KebabCaseToCamelCase<TrimWhiteSpace<Prop>>]: GetType<
          TrimWhiteSpace<Value>
        >;
      } & ParseCSSProps<Rest>
    : unknown;

type GetRestCSS<Rest extends string> =
  TrimWhiteSpace<Rest> extends `${infer Content}}${infer RRest}` ? RRest : Rest;

type ParseRestCSS<Rest extends string> =
  TrimWhiteSpace<Rest> extends `${infer Content}}${infer RRest}`
    ? ParseCSSProps<Content>
    : string;

type ParseCSS<S extends string> = string extends S
  ? "Error"
  : TrimWhiteSpace<S> extends `${infer ClassName} {${infer Rest}`
  ?
      | {
          [k in TrimWhiteSpace<ClassName>]: ParseRestCSS<Rest>;
        }
      | ParseCSS<GetRestCSS<Rest>>
  : string;

type CSSTypes = ParseCSS<`
  body { 
    max-width: 20px;
    background-color: lightblue;
    animation-timing-function: ease;
  }

  .h1 {
    color: white;
  }

  #p {
    font-family: verdana;
    font-size: 20px;
  }
`>;

const allRight: CSSTypes = {
  body: {
    backgroundColor: "red",
    maxWidth: 100,
    animationTimingFunction: "ease",
  },
  "#p": {
    fontFamily: "verdana",
    fontSize: 10,
  },
  ".h1": { color: "white" },
};

// @ts-expect-error
const willError: CSSTypes = {
  // Property '"max-width"' is missing in
  body: {
    backgroundColor: "red",
    animationTimingFunction: "ease",
  },
  "#p": {
    fontFamily: "verdana",
    fontSize: 10,
  },
  ".h1": { color: "white" },
};

export {};
