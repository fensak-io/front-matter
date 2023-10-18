// Copyright (c) Fensak, LLC.
// SPDX-License-Identifier: MPL-2.0

import fs from "node:fs";

import { expect, test } from "@jest/globals";

import { extract, hasParsableFrontMatter } from "./extract.ts";
import { expectedBasicData } from "./test_utils.ts";
import type { Basic } from "./test_utils.ts";

test("extract yaml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml1.md`, "utf8");
  expect(hasParsableFrontMatter(md)).toBe(true);
  expect(extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("extract json", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/json1.md`, "utf8");
  expect(hasParsableFrontMatter(md)).toBe(true);
  expect(extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("extract toml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/toml1.md`, "utf8");
  expect(hasParsableFrontMatter(md)).toBe(true);
  expect(extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("can detect when there is no frontmatter", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/none.md`, "utf8");
  expect(hasParsableFrontMatter(md)).toBe(false);
});

test("properly handles front matter like body", () => {
  const md = fs.readFileSync(
    `${__dirname}/testdata/body/horizontalrulers.md`,
    "utf8",
  );
  expect(hasParsableFrontMatter(md)).toBe(false);
});
