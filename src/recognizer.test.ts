// Copyright (c) Fensak, LLC.
// SPDX-License-Identifier: MPL-2.0

import fs from "node:fs";

import { expect, test } from "@jest/globals";

import {
  yamlRecognizer,
  jsonRecognizer,
  tomlRecognizer,
} from "./recognizer.ts";
import { expectedBasicData } from "./test_utils.ts";
import type { Basic, Nested } from "./test_utils.ts";

test("recognize basic yaml format type 1 (---)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml1.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(true);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract basic yaml format type 1 (---)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml1.md`, "utf8");
  expect(yamlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic yaml format type 2 (---yaml)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml2.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(true);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract basic yaml format type 2 (---yaml)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml2.md`, "utf8");
  expect(yamlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic yaml format type 3 (= yaml =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml3.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(true);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract basic yaml format type 3 (= yaml =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/yaml3.md`, "utf8");
  expect(yamlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic json format type 1 (---json)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/json1.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(true);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract basic json format type 1 (---json)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/json1.md`, "utf8");
  expect(jsonRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic json format type 2 (= json =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/json2.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(true);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract basic json format type 2 (= json =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/json2.md`, "utf8");
  expect(jsonRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic toml format type 1 (---toml)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/toml1.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(true);
});

test("extract basic toml format type 1 (---toml)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/toml1.md`, "utf8");
  expect(tomlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize basic toml format type 2 (= toml =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/toml2.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(true);
});

test("recognize basic toml format type 2 (= toml =)", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/basic/toml2.md`, "utf8");
  expect(tomlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});

test("recognize nested yaml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/yaml.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(true);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract nested yaml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/yaml.md`, "utf8");
  expect(yamlRecognizer.extract<Nested>(md).attrs).toEqual({
    title: "Project title",
    data: "Potentially nested data that gets --- parsed incorrectly.",
  });
});

test("recognize nested json", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/json.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(true);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("recognize nested json", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/json.md`, "utf8");
  expect(jsonRecognizer.extract<Nested>(md).attrs).toEqual({
    title: "Project title",
    data: "Potentially nested data that gets ---json parsed incorrectly.",
  });
});

test("recognize nested toml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/toml.md`, "utf8");
  expect(yamlRecognizer.recognize(md)).toBe(false);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(true);
});

test("extract nested toml", () => {
  const md = fs.readFileSync(`${__dirname}/testdata/nested/toml.md`, "utf8");
  expect(tomlRecognizer.extract<Nested>(md).attrs).toEqual({
    title: "Project title",
    data: "Potentially nested data that gets ---toml parsed incorrectly.",
  });
});

test("recognize when there are line headers in body", () => {
  const md = fs.readFileSync(
    `${__dirname}/testdata/body/lineheaders.md`,
    "utf8",
  );
  expect(yamlRecognizer.recognize(md)).toBe(true);
  expect(jsonRecognizer.recognize(md)).toBe(false);
  expect(tomlRecognizer.recognize(md)).toBe(false);
});

test("extract when there are line headers in body", () => {
  const md = fs.readFileSync(
    `${__dirname}/testdata/body/lineheaders.md`,
    "utf8",
  );
  expect(yamlRecognizer.extract<Basic>(md).attrs).toEqual(expectedBasicData);
});
