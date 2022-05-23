import { Equal, Expect } from "./test-utils";

type RemoveProtocol<T> = T extends `${infer _Protocol}://${infer Rest}`
  ? Rest
  : T;
type RemoveFragment<T> = T extends `${infer Query}#${infer _}` ? Query : T;
type RemoveParams<T> = T extends `${infer Pathname}?${infer _Params}`
  ? Pathname
  : T;

type ExtractProtocol<T> = T extends `${infer Protocol}://${infer _Rest}`
  ? `${Protocol}:`
  : never;

type MaybeLiteralsAfterHostname = "/" | ":" | "?";
type ExtractHost<T extends string> = T extends string
  ? RemoveProtocol<T> extends `${infer Host}${MaybeLiteralsAfterHostname}${infer _}`
    ? Host extends `${infer Name}:${infer _Port}`
      ? Name
      : Host extends `${infer Name}/${infer _Path}`
      ? Name
      : Host extends `${infer Name}?${infer _Query}`
      ? Name
      : Host
    : RemoveProtocol<T>
  : never;

type ExtractPathname<T extends string> =
  RemoveProtocol<T> extends `${ExtractHost<T>}${infer Rest}`
    ? Rest extends `:${number}/${infer Pathname}`
      ? `/${RemoveParams<Pathname>}`
      : Rest extends `:${number}`
      ? "/"
      : RemoveParams<Rest>
    : "/";

type MaybeLiteralsAfterPort = "/" | "?" | "#";
type ExtractPort<T extends string> =
  // if host contains www. bail out
  ExtractHost<T> extends `www.${infer _}`
    ? ""
    : RemoveProtocol<T> extends `${infer _}:${infer Port}${MaybeLiteralsAfterPort}${infer _Rest}`
    ? Port extends `${number}`
      ? Port
      : "" & never // dismiss union
    : RemoveProtocol<T> extends `${infer _}:${infer Port}`
    ? Port
    : "";

type ExtractQueryParams<T extends string> =
  T extends `${infer _Pathname}?${infer Query}`
    ? `?${RemoveFragment<Query>}`
    : "";

type ExtractHashFragment<T extends string> =
  T extends `${infer _Pathname}#${infer Hash}` ? `#${Hash}` : "";

type ParseURL<T extends string> = {
  hostname: ExtractHost<T>;
  protocol: ExtractProtocol<T>;
  pathname: ExtractPathname<T>;
  search: ExtractQueryParams<T>;
  port: ExtractPort<T>;
  hash: ExtractHashFragment<T>;
};

type Demo0 = ParseURL<"https://tsplay.dev/WYYMdW">;
type Demo1 = ParseURL<"http://localhost.com:8000">;
type Demo2 = ParseURL<"https://anuraghazra.dev/nice/work?nice=work&nice=2">;
type Demo3 = ParseURL<"ssl://localhost.com?nice=wok">;
type Demo4 =
  ParseURL<"http://www.example.com:8000/path/to/file.html?key=1&val=2&nice=d#hash">;
type Demo5 =
  ParseURL<"http://example.com:22/path/to/file.html?key=1&val=2&val=3#hash">;
type Demo6 = ParseURL<"http://example.com/path/to/file.html?key=1&val=2#hash">;

type Tests = [
  Expect<
    Equal<
      Demo0,
      {
        hostname: "tsplay.dev";
        protocol: "https:";
        pathname: "/WYYMdW";
        search: "";
        port: "";
        hash: "";
      }
    >
  >,
  Expect<
    Equal<
      Demo1,
      {
        hostname: "localhost.com";
        protocol: "http:";
        pathname: "/";
        search: "";
        port: "8000";
        hash: "";
      }
    >
  >,
  Expect<
    Equal<
      Demo2,
      {
        hostname: "anuraghazra.dev";
        protocol: "https:";
        pathname: "/nice/work";
        search: "?nice=work&nice=2";
        port: "";
        hash: "";
      }
    >
  >,
  Expect<
    Equal<
      Demo3,
      {
        hostname: "localhost.com";
        protocol: "ssl:";
        pathname: "";
        search: "?nice=wok";
        port: "";
        hash: "";
      }
    >
  >,
  Expect<
    Equal<
      Demo4,
      {
        hostname: "www.example.com";
        protocol: "http:";
        pathname: "/path/to/file.html";
        search: "?key=1&val=2&nice=d";
        port: "";
        hash: "#hash";
      }
    >
  >,
  Expect<
    Equal<
      Demo5,
      {
        hostname: "example.com";
        protocol: "http:";
        pathname: "/path/to/file.html";
        search: "?key=1&val=2&val=3";
        port: "22";
        hash: "#hash";
      }
    >
  >,
  Expect<
    Equal<
      Demo6,
      {
        hostname: "example.com";
        protocol: "http:";
        pathname: "/path/to/file.html";
        search: "?key=1&val=2";
        port: "";
        hash: "#hash";
      }
    >
  >
];

export {};
