// Copyright (c) Fensak, LLC.
// SPDX-License-Identifier: MPL-2.0

import {
  Extract,
  yamlRecognizer,
  jsonRecognizer,
  tomlRecognizer,
} from "./recognizer.ts";

// Reexport the Extract type so external users can use it
export type { Extract };

/**
 * Determines if the given markdown string has any front matter that can be parsed.
 * @param str String to recognize.
 * @returns A boolean indicating whether the string has parsable front matter.
 */
export function hasParsableFrontMatter(str: string): boolean {
  return (
    yamlRecognizer.recognize(str) ||
    jsonRecognizer.recognize(str) ||
    tomlRecognizer.recognize(str)
  );
}

/**
 * Extracts front matter encoded as YAML, TOML, or JSON from the given string.
 * @param str String to recognize.
 * @returns The markdown broken down into the front matter and the body, with the front matter parsed as an object.
 */
export function extract<T>(str: string): Extract<T> {
  if (yamlRecognizer.recognize(str)) {
    return yamlRecognizer.extract<T>(str);
  } else if (jsonRecognizer.recognize(str)) {
    return jsonRecognizer.extract<T>(str);
  } else if (tomlRecognizer.recognize(str)) {
    return tomlRecognizer.extract<T>(str);
  }

  throw new TypeError(`Unsupported front matter format`);
}
