type IsNever<T> = [T] extends [never] ? true : false;
type TruthyKind = Record<string, boolean>;
type StringOrTruthy = string | TruthyKind | unknown;

/**
 * Filter tuple by type (ignore never type)
 *
 * - Filter<["bg", never], string> -> ["bg"]
 */
type Filter<Arr extends unknown[], FilterBy> = Arr extends [
  infer Value,
  ...infer Rest
]
  ? IsNever<Value> extends true
    ? Filter<Rest, FilterBy>
    : Value extends FilterBy
    ? [Value, ...Filter<Rest, FilterBy>]
    : Filter<Rest, FilterBy>
  : Arr;

/**
 * Joins array of string also filters `never` values
 */
type JoinStr<
  T extends (string | unknown)[],
  Sep extends string = "",
  Arr = Filter<T, string>
> = Arr extends []
  ? ""
  : Arr extends [string]
  ? `${Arr[0]}`
  : Arr extends [string, ...infer Rest]
  ? `${Arr[0]}${Sep}${JoinStr<Rest, Sep>}`
  : string;

/**
 * ----- Union To Tuple Logic ----
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

type D = LastOf<1 | 2>;
type Push<T extends any[], V> = [...T, V];

type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

/**
 * Extract and pick truthy classes
 * - {bar: true} -> "bar"
 * - {bar: false} -> never
 * - "bar" -> "bar"
 */
type PickTruthy<Obj extends StringOrTruthy> = [Obj] extends [TruthyKind]
  ? JoinStr<
      TuplifyUnion<
        { [P in keyof Obj]: Obj[P] extends true ? P : never }[keyof Obj]
      >,
      " "
    >
  : Obj;

/**
 * Filter boolean classes
 * - ["hello", { bar: true }, { foo: false }] -> ["hello", "bar", never]
 */
type GetBooleanClasses<T extends StringOrTruthy[]> = T extends [
  infer Itm,
  ...infer Rest
]
  ? [Itm extends string ? Itm : PickTruthy<Itm>, ...GetBooleanClasses<Rest>]
  : [];

type ClassNames<T extends StringOrTruthy[]> = JoinStr<
  GetBooleanClasses<T>,
  " "
>;

const classNames = <T extends (string | TruthyKind)[]>(...classes: T) => {
  return classes.join(" ") as unknown as ClassNames<T>;
};

const t1 = classNames("foo", "bar"); // => 'foo bar'
const t2 = classNames("foo", { bar: true }); // => 'foo bar'
const t3 = classNames({ "foo-bar": true }); // => 'foo-bar'
const t4 = classNames({ "foo-bar": false }); // => ''
const t5 = classNames({ foo: true }, { bar: true }); // => 'foo bar'
const t6 = classNames({ foo: true, bar: true }); // => foo bar
const t7 = classNames("foo", { bar: true, duck: false }, "baz", { quux: true }); // => 'foo bar baz quux'
const t8 = classNames("bg", { foo: true, bar: true }); // => bg foo bar