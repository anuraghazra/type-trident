declare const _brand: unique symbol;
/**
 * Brands a type making them act as nominal
 * Default name is set to DefaultName for convenience
 */
type Brand<Type, Name = "DefaultName"> = Type & { [_brand]: Name };

/**
 * Drops a specific value from tuple
 *
 * type K = Filter<[1, 2, 3, never], never>
 * // -> [1, 2, 3]
 */
type Filter<A, Type> = A extends [infer E, ...infer R]
  ? [E] extends [Type]
    ? Filter<R, Type>
    : [E, ...Filter<R, Type>]
  : [];

/**
 * Drops branded types from the array and returns the length
 *
 * type K = GenericArgCount<["hello", Brand<"hello">]>
 * // -> 1
 */
type GenericArgCount<Args extends any[]> = Filter<
  Args,
  Brand<Args[number]>
>["length"];

type Cast<Value1, Value2> = Value1 & Value2;

type Path<
  Obj,
  Key1 extends keyof Obj = Brand<keyof Obj>,
  Key2 extends keyof Obj[Key1] = Brand<keyof Obj[Key1]>,
  Key3 extends keyof Obj[Key1][Key2] = Brand<keyof Obj[Key1][Key2]>,
  Key4 extends keyof Obj[Key1][Key2][Key3] = Brand<keyof Obj[Key1][Key2][Key3]>,
  ArgCount = GenericArgCount<[Key1, Key2, Key3, Key4]>
> = {
  0: Obj;
  1: Obj[Key1];
  2: Obj[Key1][Key2];
  3: Obj[Key1][Key2][Key3];
  4: Obj[Key1][Key2][Key3][Key4];
}[Cast<ArgCount, 0 | 1 | 2 | 3 | 4>];

const obj = {
  hello: {
    world: {
      deep: {
        nested: "nice",
      },
    },
  },
} as const;

type Demo1 = Path<typeof obj, "hello", "world", "deep", "nested">;
// -> "nice"
type Demo2 = Path<typeof obj, "hello", "world">;
// -> readonly deep: { readonly nested: "nice"; };

export {};
