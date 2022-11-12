// Insertion sort based on https://stackoverflow.com/a/70337367/10629172
type InsertionSort<
  Src extends any[],
  Dst extends any[] = []
> = Src["length"] extends 0
  ? Dst
  : InsertionSort<Slice<Src, 1>, Insert<Dst, Src[0]>>;

type Insert<T extends number[], X extends number> = T["length"] extends 0
  ? [X]
  : M.Comparator<X, T[0]> extends true
  ? [T[0], ...Insert<Slice<T, 1>, X>]
  : [X, ...T];

type Demo = InsertionSort<[8, 200, 2, 100, 181, 129, 49, 91, 11, 0, 44]>;

// Credits to twitter.com/@pranshushah1 for this wonderful Slice method
type Slice<
  Arr extends any[],
  Start extends number = 0,
  End extends number = Arr["length"],
  FinalValue extends any[] = []
> = M.Comparator<End, Start> extends true
  ? Slice<
      Arr,
      M.Num<M.Add<Start, 1>>,
      M.Comparator<End, Arr["length"]> extends true ? Arr["length"] : End,
      M.Push<FinalValue, Arr[Start]>
    >
  : FinalValue;

// Math Utils
namespace M {
  export type Num<T> = Extract<T, number>;
  type Length<T extends any[]> = T["length"];
  export type Push<T extends any[], Val> = [...T, Val];
  type NTuple<N extends number, T extends any[] = []> = T["length"] extends N
    ? T
    : NTuple<N, Push<T, any>>;

  export type Add<A extends number, B extends number> = M.Num<
    Length<[...NTuple<A>, ...NTuple<B>]>
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
