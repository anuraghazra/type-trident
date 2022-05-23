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

type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>;

type Comparator<N1 extends number, N2 extends number> = N1 extends N2
  ? false
  : [Subtract<N2, N1>] extends [never]
  ? true
  : false;

type Demo1 = Add<2, 3>;
type Demo2 = Subtract<2, 3>;
type Demo3 = Multiply<2, 3>;
type Demo4 = Comparator<2, 3>;
type Demo5 = Comparator<5, 3>;
