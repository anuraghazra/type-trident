type BubbleSort<
  A extends any[],
  Curr extends number = A["length"]
> = Curr extends 1
  ? A
  : A extends [infer F, infer S, ...infer Rest]
  ? BubbleSort<
      [
        ...(M.Comparator<M.Num<F>, M.Num<S>> extends true
          ? [S, ...BubbleSort<[F, ...Rest], M.Sub<Curr, 1>>]
          : [F, ...BubbleSort<[S, ...Rest], M.Sub<Curr, 1>>])
      ],
      M.Sub<Curr, 1>
    >
  : never;

type Demo1 = BubbleSort<[9, 8, 2, 6, 5, 4, 1]>;
//   ^?    = [1, 2, 4, 5, 6, 8, 9]

type Demo2 = BubbleSort<[234, 43, 55, 63, 5, 6, 235, 547]>;

// Math Utils
namespace M {
  export type Num<T> = Extract<T, number>;
  type Length<T extends any[]> = T["length"];
  type Push<T extends any[], Val> = [...T, Val];
  type NTuple<N extends number, T extends any[] = []> = T["length"] extends N
    ? T
    : NTuple<N, Push<T, any>>;

  export type Add<A extends number, B extends number> = Length<
    [...NTuple<A>, ...NTuple<B>]
  >;
  export type Sub<A extends number, B extends number> = NTuple<A> extends [
    ...infer U,
    ...NTuple<B>
  ]
    ? Length<U>
    : never;

  export type Comparator<N1 extends number, N2 extends number> = N1 extends N2
    ? false
    : [Sub<N2, N1>] extends [never]
    ? true
    : false;
}

// JS equivalent
function bubbleSort(input: number[], curr: number = 0): number[] {
  if (curr == input.length) {
    return input;
  }
  for (let i = 0; i < input.length; i++) {
    if (input[i] > input[i + 1]) {
      let newvar = input[i];
      input[i] = input[i + 1];
      input[i + 1] = newvar;
    }
  }
  return bubbleSort(input, curr + 1);
}

bubbleSort([234, 43, 55, 63, 5, 6, 235, 547]);
