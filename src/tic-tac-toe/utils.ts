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

  export type Comparator<N1 extends number, N2 extends number> = N1 extends N2
    ? false
    : [Subtract<N2, N1>] extends [never]
    ? true
    : false;
}

export type IsNever<T> = [T] extends [never] ? true : false;

export type BoardKey<B extends FlattenBoardShape> =
  `${B[0]}_${B[1]}_${B[2]}_${B[3]}_${B[4]}_${B[5]}_${B[6]}_${B[7]}_${B[8]}`;

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
    : "Tie"
  : never;
