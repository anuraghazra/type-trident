// Author: anuraghazra
// https://github.com/anuraghazra/type-trident

type ExtractGroups<T> = T extends `${string}(${infer Name})${infer Rest}`
  ? [Name, ...ExtractGroups<Rest>]
  : [];

type ExtractName<T> = T extends `${string}?<${infer Name}>${infer Rest}`
  ? [Name, ...ExtractName<Rest>]
  : [];

type TupleToObject<T extends string[]> = {
  [K in T[number]]: string;
};

type RegExpIndexes<T extends number[]> = {
  [K in T[number]]: string;
};

type Length<T extends any[]> = T["length"] & number;
type Push<T extends any[], Val> = [...T, Val];
type NTuple<N extends number, T extends any[] = []> = T["length"] extends N
  ? T
  : NTuple<N, Push<T, T["length"]>>;

const safeExec = <R extends string>(regex: R, str: string) => {
  type Names = ExtractName<R>;
  type Groups = TupleToObject<Names>;
  type GroupCount = ExtractGroups<R>;
  type GroupLength = Length<Push<GroupCount, any>>;

  type RegExpResult =
    | null
    | (Omit<RegExpExecArray, "length" | keyof Array<any>> & {
        length: GroupLength;
        groups: Groups;
      } & RegExpIndexes<NTuple<GroupLength>>);

  return new RegExp(regex).exec(str) as RegExpResult;
};

const regex = "First_Name: (?<firstname>w+), Last_Name: (?<lastname>w+)";
const match = safeExec(regex, "First_Name: John, Last_Name: Doe");

// has groups [0], [1], [2]
match?.[2];

// @ts-expect-error no 3rd group
match?.[3];

match?.groups.firstname; // <-- auto complete
