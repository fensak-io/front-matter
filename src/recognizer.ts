// Copyright (c) Fensak, LLC.
// SPDX-License-Identifier: MPL-2.0

import YAML from "yaml";
import toml from "toml";

const maybeByteOrderMark = "\\ufeff?";
const platform = typeof process !== "undefined" ? process.platform : "";

type Delimiter = { begin: string; end: string };

export type Extract<T> = {
  frontMatter: string;
  body: string;
  attrs: T;
};

type Parser = <T = Record<string, unknown>>(str: string) => T;

class Recognizer {
  private parser: Parser;
  private recognizeRE: RegExp;
  private extractRE: RegExp;

  constructor(parser: Parser, ...dv: Delimiter[]) {
    this.parser = parser;

    const beginPattern = `(${dv.map((d) => d.begin).join("|")})`;
    const endPattern = `^(?:${dv.map((d) => d.end).join("|")})\\s*$`;
    const pattern =
      "^(" +
      maybeByteOrderMark +
      beginPattern +
      "$([\\s\\S]*?)" +
      endPattern +
      (platform === "win32" ? "\\r?" : "") +
      "(?:\\n)?)";

    this.recognizeRE = new RegExp("^" + beginPattern + "$", "im");
    this.extractRE = new RegExp(pattern, "im");
  }

  /**
   * Determine if the given string matches this recognizer.
   * @param str The string to test.
   * @returns Whether the string matches the expected pattern for the recognizer.
   */
  recognize(str: string): boolean {
    const [firstLine] = str.split(/(\r?\n)/);
    return this.recognizeRE.test(firstLine);
  }

  /**
   * Extract the front matter using the registered RegExp for this recognizer. Use the type parameter to type the parsed
   * data.
   * @param str The string to extract front matter from.
   * @returns The markdown broken down into the front matter and the body, with the front matter parsed as an object.
   */
  extract<T>(str: string): Extract<T> {
    const match = this.extractRE.exec(str);
    if (!match || match.index !== 0) {
      throw new TypeError("Unexpected end of input");
    }
    const frontMatter = match.at(-1)?.replace(/^\s+|\s+$/g, "") || "";
    const attrs = this.parser(frontMatter) as T;
    const body = str.replace(match[0], "");
    return { frontMatter, body, attrs };
  }
}

/**
 * A recognizer for detecting and parsing YAML based front matter.
 */
export const yamlRecognizer = new Recognizer(
  ((str: string) => YAML.parse(str)) as Parser,
  { begin: "---yaml", end: "---" },
  { begin: "= yaml =", end: "= yaml =" },
  { begin: "---", end: "---" },
);

/**
 * A recognizer for detecting and parsing JSON based front matter.
 */
export const jsonRecognizer = new Recognizer(
  ((str: string) => JSON.parse(str)) as Parser,
  { begin: "---json", end: "---" },
  { begin: "= json =", end: "= json =" },
);

/**
 * A recognizer for detecting and parsing TOML based front matter.
 */
export const tomlRecognizer = new Recognizer(
  ((str: string) => toml.parse(str)) as Parser,
  { begin: "---toml", end: "---" },
  { begin: "= toml =", end: "= toml =" },
);
