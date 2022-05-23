import React from "react";
import { FormattedMessage } from "react-intl";

const messages = {
  en: {
    GREETING: "Hello {name}",
    INTRO: "My name is {name} & I'm {age} years old",
    HEADER: "Typesafe react-int is {expression}, TS is {love}",
  },
  fr: {
    GREETING: "Hello {name}",
    INTRO: "My name is {name} & I'm {age} years old",
    HEADER: "Typesafe react-int is {expression}, TS is {love}",
  },
} as const;

export type Messages = typeof messages["en"];

export type ExtractValues<T extends string> =
  T extends `${string}{${infer Prop}}${infer Rest}`
    ? Prop | ExtractValues<Rest>
    : never;

type Props = Omit<
  React.ComponentProps<typeof FormattedMessage>,
  "id" | "values"
>;

const TypedFormattedMessage = <Id extends keyof Messages>(
  props: Props & {
    id: Id;
    values: Record<ExtractValues<Messages[Id]>, React.ReactNode>;
  }
) => {
  return <FormattedMessage {...props} />;
};

const t = (
  <>
    <TypedFormattedMessage id="GREETING" values={{ name: "Anurag" }} />
    <TypedFormattedMessage
      id="HEADER"
      values={{ expression: "Amazing", love: "love" }}
      // ^ proper intellisense
    />
    <TypedFormattedMessage
      id="INTRO"
      values={{ name: "Anurag" }}
      // ^ age is missing
    />
    <TypedFormattedMessage
      id="INVALID-ID"
      // ^ Type '"INVALID-ID"' is not assignable to type '"GREETING" | "MSG" | "HEADER"'
    />
  </>
);
