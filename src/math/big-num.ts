export namespace BigNumM {
// Private
  type NTuple<
    N extends number,
    T extends any[] = []
  > = Length<T> extends N ? T : NTuple<N, [...T, any]>;

  type Increment<T extends number> = Length<[...NTuple<T>, any]>;

  type Not<T extends boolean> = T extends true ? false : true;

  type Series<S extends number, E extends number, Result = never> = S extends E
    ? Result
    : Series<Increment<S>, E, Result | S>;

  type StringToNumber<T extends string> = T extends `${infer a extends number}`
    ? a
    : never;

  type NumberToString<T extends number> = `${T}`;

  type Digit = Series<0, 10>;

  // K/V pair of numbers
  // K - Number
  // V - Numbers that K is greater than
  type GreaterMap = {
    [k in Digit]: Exclude<Series<0, k>, k>
  }

  type StringLength<
    T extends String,
    Result extends number = 0
  > = T extends `${infer _}${infer Rest}`
    ? StringLength<Rest, Increment<Result>>
    : Result;

  type PopFirstChar<T extends String> = T extends `${infer _}${infer Rest}` ? Rest : "";

  type GetFirstChar<T extends String> = T extends `${infer U}${infer _}` ? U : "";

  // A > B
  type GreaterThanString<A extends String, B extends String> = A extends B
    ? false // check if equal, return false.
    : GreaterThanString< // check if A's number of digits is greater than B's
        NumberToString<StringLength<A>>,
        NumberToString<StringLength<B>>
      > extends true
    ? true // if yes, then A is greater than B
    : StringLength<A> extends StringLength<B> // check if A's number of digits is equal to B's
    ? Extract< // check if the first digit of A is greater than B
        GreaterMap[Extract<StringToNumber<GetFirstChar<A>>, Digit>],
        StringToNumber<GetFirstChar<B>>
      > extends never
      ? GreaterThanString<PopFirstChar<A>, PopFirstChar<B>> // if it isnt, then check the next digit
      : true
    : false; // If A's number of digits is less than B's, then A is less than B


// Public
  export type Length<T extends Array<any>> = T["length"] & number;

  // A > B return true, else false
  export type GreaterThan<
    A extends number,
    B extends number
  > = NumberToString<A> extends `-${infer AStr extends string}` // if A is negative
    ? NumberToString<B> extends `-${infer BStr extends string}` // if A is negative and B is negative
      ? Not<GreaterThanString<AStr, BStr>> // then ~(A > B)
      : false // otherwise, definitely -A < B so return false
    : NumberToString<B> extends `-${infer _}` // A is positive, check B
    ? true // if A is positive and B is negative, then definitely A > B. Return true
    : GreaterThanString<NumberToString<A>, NumberToString<B>>; // otherwise, check if A > B
}
