// Math Utils
namespace M {
  export type Length<T extends any[]> = T["length"];
  type Push<T extends any[], Val> = [...T, Val];
  export type NTuple<N extends number, T extends any[] = []> = N extends 0
    ? []
    : T["length"] extends N
    ? T
    : NTuple<N, Push<T, T["length"]>>;

  export type Add<A extends number, B extends number> = Length<
    [...NTuple<A>, ...NTuple<B>]
  >;
}

type Decimals = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Range<S extends number, E extends number> = ToNumber<
  `${Exclude<M.NTuple<E>[number], M.NTuple<S>[number]>}.${Decimals}` | `${E}.0`
>;

type ToNumber<T extends string> =
  // handle zero explicitly
  T extends `${infer N extends number}.0`
    ? N
    : T extends `${infer N extends number}.${infer Decimal}${0}`
    ? ToNumber<`${N}.${Decimal}`>
    : T extends `${infer N extends number}`
    ? N
    : never;

type D1 = Range<0, 1>;
type D2 = Range<4, 5>;
type D3 = Range<90, 100>;

export {};
