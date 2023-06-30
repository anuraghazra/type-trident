// Leetcode 13. Roman to Integer - On TypeLevel
// https://leetcode.com/problems/roman-to-integer/description/
// by https://github.com/anuraghazra/type-trident

type RomanToIntMap = {
  I: 1;
  V: 5;
  X: 10;
  L: 50;
  C: 100;
  D: 500;
  M: 1000;
};

type RomanToIntArray<
  S extends string,
  Parts extends string[] = Split<S, "">
> = {
  [K in keyof Parts]: RomanToIntMap[Parts[K] & keyof RomanToIntMap];
} & number[];

type RomanToInt<
  S extends string,
  A extends number[] = RomanToIntArray<S>,
  Curr extends number = 0,
  Next extends number = 1,
  Final extends number = 0
> = Curr extends A["length"]
  ? Final
  : [
      A[Next] extends undefined ? false : true,
      M.GreaterThan<A[Next], A[Curr]>
    ] extends [true, true]
  ? RomanToInt<S, A, M.Add<Curr, 1>, M.Add<Next, 1>, M.Sub<Final, A[Curr]>>
  : RomanToInt<S, A, M.Add<Curr, 1>, M.Add<Next, 1>, M.Add<Final, A[Curr]>>;

type Demo1 = RomanToInt<"III">; // 3
type Demo2 = RomanToInt<"LVIII">; // 58
type Demo3 = RomanToInt<"DXL">; // 540
type Demo4 = RomanToInt<"MMI">; // 2001
type Demo5 = RomanToInt<"MCMXCIV">; // 1994

// String util
type Split<
  Str extends string,
  SplitBy extends string
> = Str extends `${infer P1}${SplitBy}${infer P2}`
  ? [P1, ...Split<P2, SplitBy>]
  : Str extends ""
  ? []
  : [Str];

// NTuple Util
namespace N {
  // Trampoline to increase recursion limit
  // https://github.com/Microsoft/TypeScript/issues/14833#issuecomment-534274187
  // https://stackoverflow.com/questions/189725/what-is-a-trampoline-function
  // This is a bad idea, because we will be generating shit ton of tuples and hogging up memory
  // But i'm too lazy to do a rewrite of Math implementation with Sum tables
  export type NTuple<N extends number> = Increase<N, []>;

  type Increase<
    N extends number,
    U extends 1[]
  > = N extends Partial<U>["length"]
    ? Decrease<N, U>
    : Increase<N, Unshift8<U, 1>>;

  // Decrease by 1 if U has larger size, otherwise return U
  type Decrease<N extends number, U extends any[]> = U["length"] extends N
    ? U
    : Decrease<N, Drop<U>>;

  // Could modify this to 16, or 32 to increase the limit more
  type Unshift8<U extends T[], T> = [T, T, T, T, T, T, T, T, ...U];

  type Drop<T extends any[]> = T extends [...infer R, infer End] ? R : never;
}

// Math Utils
namespace M {
  export type Num<T> = Extract<T, number>;
  type Length<T extends any[]> = Num<T["length"]>;

  export type Add<
    A extends number,
    B extends number
  > = N.NTuple<A> extends infer AT extends 1[]
    ? N.NTuple<B> extends infer BT extends 1[]
      ? Length<[...AT, ...BT]>
      : never
    : never;

  export type Sub<
    A extends number,
    B extends number
  > = N.NTuple<B> extends infer BT extends 1[]
    ? N.NTuple<A> extends [...infer U, ...BT]
      ? Length<U>
      : never
    : never;

  export type GreaterThan<N1 extends number, N2 extends number> = N1 extends N2
    ? false
    : [Sub<N2, N1>] extends [never]
    ? true
    : false;
}

export {};
