// Leetcode 1209. Remove All Adjacent Duplicates in String II - On TypeLevel
// https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/
// by https://github.com/anuraghazra/type-trident

// String Utils
type Primitive = string | number | boolean | bigint;

type Split<
  Str extends string,
  SplitBy extends string
> = Str extends `${infer P1}${SplitBy}${infer P2}`
  ? [P1, ...Split<P2, SplitBy>]
  : Str extends ""
  ? []
  : [Str];

type Repeat<
  S extends string,
  N extends number,
  I extends 0[] = []
> = I["length"] extends N ? S : `${S}${Repeat<S, N, [...I, 0]>}`;

type Join<T extends unknown[], D extends string> = T extends []
  ? ""
  : T extends [Primitive]
  ? `${T[0]}`
  : T extends [Primitive, ...infer U]
  ? `${T[0]}${D}${Join<U, D>}`
  : string;

// Tuple Utils
type Tail<T extends unknown[]> = T extends [...infer Rest, infer End]
  ? End
  : never;

type Shift<T extends unknown[]> = T extends [infer F, ...infer Rest]
  ? Rest
  : never;

type Pop<T extends unknown[]> = T extends [...infer Rest, infer L]
  ? Rest
  : never;

// Smol utils
type IsNever<T> = [T] extends [never] ? true : false;
type Or<A, B> = [A, B] extends [false, false] ? false : true;
type Equals<A, B> = A extends B ? true : false;
type NotEquals<A, B> = A extends B ? false : true;

// Math Utils
namespace M {
  type Num<T> = Extract<T, number>;
  type Length<T extends any[]> = T["length"];
  type Push<T extends any[], Val> = [...T, Val];
  type NTuple<N extends number, T extends any[] = []> = T["length"] extends N
    ? T
    : NTuple<N, Push<T, any>>;

  export type Add<A extends number, B extends number> = Num<
    Length<[...NTuple<A>, ...NTuple<B>]>
  >;
  export type Sub<A extends number, B extends number> = NTuple<A> extends [
    ...infer U,
    ...NTuple<B>
  ]
    ? Length<U>
    : never;
}

// Main Implementation

type StackData = { char: string; count: number };
type ImplRemoveDuplicates<
  S extends string,
  K extends number,
  A extends string[] = Split<S, "">,
  CurrIdx extends number = 0,
  Stack extends [StackData] | StackData[] = []
> =
  // We are finished looping return the final stack
  CurrIdx extends A["length"]
    ? Stack
    : // If stack is empty or current char is not in stack add it to the stack
    Or<
        Equals<Stack["length"], 0>,
        NotEquals<A[CurrIdx], Tail<Stack>["char"]>
      > extends true
    ? ImplRemoveDuplicates<
        S,
        K,
        A,
        M.Add<CurrIdx, 1>,
        [...Stack, { char: A[CurrIdx]; count: 1 }]
      >
    : M.Add<Tail<Stack>["count"], 1> extends K
    ? ImplRemoveDuplicates<S, K, A, M.Add<CurrIdx, 1>, Pop<Stack>>
    : ImplRemoveDuplicates<
        S,
        K,
        A,
        M.Add<CurrIdx, 1>,
        [
          ...Pop<Stack>,
          {
            char: Tail<Stack>["char"];
            count: M.Add<Tail<Stack>["count"], 1>;
          }
        ]
      >;

type MapChars<T extends StackData[]> = {
  [K in keyof T]: Repeat<T[K]["char"], M.Sub<T[K]["count"], 1>>;
};

type RemoveDuplicates<
  S extends string,
  K extends number
> = ImplRemoveDuplicates<S, K> extends [...infer Return extends StackData[]]
  ? MapChars<Return> extends [...infer Final]
    ? Join<Final, "">
    : never
  : never;

type Demo1 = RemoveDuplicates<"deeedbbcccbdaa", 3>;
type Demo2 = RemoveDuplicates<"aabbbcdddcc", 3>;
type Demo3 = RemoveDuplicates<"pbbcggttciiippooaais", 2>;
type Demo5 = RemoveDuplicates<"heeeeeeelloooooo", 3>;
type Demo6 = RemoveDuplicates<"nooooorepeating", 2>;

export {};
