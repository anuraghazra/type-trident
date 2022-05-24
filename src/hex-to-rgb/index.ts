type HexMap = {
  "0": 0;
  "1": 1;
  "2": 2;
  "3": 3;
  "4": 4;
  "5": 5;
  "6": 6;
  "7": 7;
  "8": 8;
  "9": 9;
  A: 10;
  B: 11;
  C: 12;
  D: 13;
  E: 14;
  F: 15;
};

type GetDec<T> = T extends keyof HexMap ? HexMap[T] : never;
type Length<T extends any[]> = T["length"] & number;
type Push<T extends any[], Val> = [...T, Val];
type Drop<T extends any[]> = T extends [...infer R, infer End] ? R : never;

type Unshift8<U extends T[], T> = [T, T, T, T, T, T, T, T, ...U];

type NTuple<
  N extends number,
  T extends any[] = []
> = N extends Partial<T>["length"]
  ? Decrease<N, T>
  : NTuple<N, Unshift8<T, any>>;

type Decrease<N extends number, U extends any[]> = U["length"] extends N
  ? U
  : Decrease<N, Drop<U>>;

type Add<A extends number, B extends number, C extends any[] = []> = Length<
  // @ts-ignore
  [...NTuple<A>, ...NTuple<B>]
>;

type Subtract<A extends number, B extends number> = NTuple<A> extends [
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

type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>;

type HexToRgb<T> =
  T extends `${infer R1}${infer R2}${infer G1}${infer G2}${infer B1}${infer B2}`
    ? [
        Add<Multiply<GetDec<R1>, 16>, GetDec<R2>>,
        Add<Multiply<GetDec<G1>, 16>, GetDec<G2>>,
        Add<Multiply<GetDec<B1>, 16>, GetDec<B2>>
      ]
    : never;

type Demo1 = HexToRgb<`AFDD55`>; // 170,221,85
type Demo2 = HexToRgb<`FF8645`>; // 255,134,69
type Demo3 = HexToRgb<`AF4E85`>; // 175,78,133

export {};
