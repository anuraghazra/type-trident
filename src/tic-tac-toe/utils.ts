import { FlattenBoardShape, P1, P2 } from ".";

// Math Utils
export namespace M {
  export type Num<T> = Extract<T, number>;
  type Length<T extends any[]> = T["length"] & number;
  type Push<T extends any[], Val> = [...T, Val];
  type NTuple<N extends number, T extends any[] = []> = T["length"] extends N
    ? T
    : NTuple<N, Push<T, any>>;

  export type Add<A extends number, B extends number> = Length<
    [...NTuple<A>, ...NTuple<B>]
  >;
  export type Subtract<A extends number, B extends number> = NTuple<A> extends [
    ...infer U,
    ...NTuple<B>
  ]
    ? Length<U>
    : never;

  type MultiAdd<
    N extends number,
    A extends number,
    I extends number
  > = I extends 0 ? A : MultiAdd<N, Add<N, A>, Subtract<I, 1>>;

  export type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>;
}

export type IsNever<T> = [T] extends [never] ? true : false;

type Repeat<
  S extends string,
  N extends number,
  I extends 0[] = []
> = I["length"] extends N ? S : `${S}${Repeat<S, N, [...I, 0]>}`;

type Split<
  Str extends string,
  SplitBy extends string
> = Str extends `${infer P1}${SplitBy}${infer P2}`
  ? [P1, ...Split<P2, SplitBy>]
  : Str extends ""
  ? []
  : [Str];

type Some<T extends any[], C> = {
  [K in Exclude<keyof T, keyof []>]: T[K] extends C ? true : never;
}[Exclude<keyof T, keyof []>];

export type CheckWinner<T> = T extends [
  infer C1,
  infer C2,
  infer C3,
  infer C4,
  infer C5,
  infer C6,
  infer C7,
  infer C8,
  infer C9
]
  ? // Horizontal
    [C1, C2, C3] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C1, C2, C3] extends [P2, P2, P2]
    ? "Player 2 Won"
    : [C4, C5, C6] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C4, C5, C6] extends [P2, P2, P2]
    ? "Player 2 Won"
    : [C7, C8, C9] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C7, C8, C9] extends [P2, P2, P2]
    ? "Player 2 Won"
    : // Vertical
    [C1, C4, C7] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C1, C4, C7] extends [P2, P2, P2]
    ? "Player 2 Won"
    : [C2, C5, C8] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C2, C5, C8] extends [P2, P2, P2]
    ? "Player 2 Won"
    : [C3, C6, C9] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C3, C6, C9] extends [P2, P2, P2]
    ? "Player 2 Won"
    : // Diag
    [C1, C5, C9] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C1, C5, C9] extends [P2, P2, P2]
    ? "Player 2 Won"
    : [C3, C5, C7] extends [P1, P1, P1]
    ? "Player 1 Won"
    : [C3, C5, C7] extends [P2, P2, P2]
    ? "Player 2 Won"
    : Some<T, 0> extends true
    ? "Incomplete"
    : "Tie"
  : never;

type RenderSymbols<T> = T extends 0
  ? "   "
  : T extends 1
  ? " X "
  : T extends 2
  ? " O "
  : T;

export type RenderBoard<
  Board extends FlattenBoardShape,
  Message extends string,
  MessageLen extends number = Split<` ${Message}`, "">["length"]
> = Board extends Board
  ? {
      1: "┌───┬───┬───┐";
      2: `│${RenderSymbols<Board[0]>}│${RenderSymbols<
        Board[1]
      >}│${RenderSymbols<Board[2]>}│`;
      3: "├───┼───┼───┤";
      4: `│${RenderSymbols<Board[3]>}│${RenderSymbols<
        Board[4]
      >}│${RenderSymbols<Board[5]>}│`;
      5: "├───┼───┼───┤";
      6: `│${RenderSymbols<Board[6]>}│${RenderSymbols<
        Board[7]
      >}│${RenderSymbols<Board[8]>}│`;
      7: "└───┴───┴───┘";
      8: `┌${Repeat<"─", MessageLen>}┐`;
      9: `│ ${Message} │`;
      0: `└${Repeat<"─", MessageLen>}┘`;
    }
  : never;
