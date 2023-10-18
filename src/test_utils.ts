// Copyright (c) Fensak, LLC.
// SPDX-License-Identifier: MPL-2.0

export interface Basic {
  title: string;
  listData: string[];
}

export const expectedBasicData: Basic = {
  title: "Project title",
  listData: ["A hero", "An antagonist", "A compelling story"],
};

export interface Nested {
  title: string;
  data: string;
}
