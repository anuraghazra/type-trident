/**
 * Fun fact: 
 * 
 * In current version of TypeScript 4.6 
 * This TokenizeTheme<> type is slow to compute but there is a faster version
 * While exploring this, I found this performance optimization trick
 * More details in this tweet: https://twitter.com/anuraghazru/status/1501989501060583443
 * 
 * And this performance bug will be fixed in 4.8.1 
 * https://github.com/microsoft/TypeScript/issues/49136
 * Thanks to Andarist for opening this issue. 
 */

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
