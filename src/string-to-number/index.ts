type ToNumber<T extends string> =
  // handle zero explicitly
  T extends `${infer N extends number}.0`
    ? N
    : T extends `${infer N extends number}.${infer Decimal}${0}`
    ? ToNumber<`${N}.${Decimal}`>
    : T extends `${infer N extends number}`
    ? N
    : never;

type D1 = ToNumber<"42.0">;
type D2 = ToNumber<"10.5">;
type D3 = ToNumber<"1.10">;
type D4 = ToNumber<"1.011">;
type D5 = ToNumber<"1.0110">;
type D6 = ToNumber<"1.234950">;
type D7 = ToNumber<"1.22002020202">;
type D8 = ToNumber<"-1.22002020202">;

// Normally without any workarounds this will result in inferre as `number` which isn't very helpful
// type ZeroDemo = "1.0" extends `${infer N extends number}` ? N : never;
// ^ number

export {};
