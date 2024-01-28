import type { BigNumM } from "../math";

// Merge two sorted arrays into one sorted array.
type Merge<
  A extends Array<number>,
  B extends Array<number>,
  Result extends Array<number> = []
> = BigNumM.Length<A> extends 0 // Check if A is empty. If yes, put all elements of B and return
  ? [...Result, ...B]
  : BigNumM.Length<B> extends 0 // Check if B is empty. If yes, put all elements of A and return
  ? [...Result, ...A]
  : A extends [A[0], ...infer ARest extends Array<number>] // Grab A's first element
  ? B extends [B[0], ...infer BRest extends Array<number>] // Grab B's first element
    ? BigNumM.GreaterThan<A[0], B[0]> extends true // Compare them
      ? Merge<A, BRest, [...Result, B[0]]> // A[0] > B[0]. Then B[0] goes
      : Merge<ARest, B, [...Result, A[0]]> // else A[0] goes
    : "B empty"
  : "A empty";

// Splits an array into two equal halves (almost equal).
type Split<
  A extends Array<number>,
  B extends Array<number> = []
> = BigNumM.Length<A> extends BigNumM.Length<B> // if length is same return (when splitting even)
  ? [A, B]
  : BigNumM.Length<[...A, any]> extends BigNumM.Length<B> // if length is A + 1 = B return (when splitting odd)
  ? [A, B] // When length of A is 1, this branch will be hit. A's elements will transfer to B.
  : A extends [A[0], ...infer ARest extends Array<number>] // Split takes first elements of A and puts them into B.
  ? Split<ARest, [...B, A[0]]>
  : never;

type MergeSort<A extends Array<number>> = Length<A> extends 0 | 1
  ? A
  : Merge<MergeSort<Split<A>[0]>, MergeSort<Split<A>[1]>>;

type mergeSortTest = MergeSort<[-1, 2, -3]>;
