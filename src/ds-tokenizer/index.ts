type Dollar<First extends boolean> = First extends true ? "$" : "";

type TokenizeTheme<Theme, First extends boolean = true> = {
  [K in keyof Theme]: `${Dollar<First>}${K & string}.${Theme[K] extends Record<
    string,
    string | number
  >
    ? Extract<keyof Theme[K], string | number>
    : TokenizeTheme<Theme[K], false>}`;
}[keyof Theme];

type Theme = {
  colors: {
    primary: {
      100: string;
      200: string;
      300: string;
    };
  };
  font: {
    family: { brand: string };
    weight: {
      100: string;
      400: string;
      700: string;
    };
  };
};

type Demo = TokenizeTheme<Theme>;

export {};
