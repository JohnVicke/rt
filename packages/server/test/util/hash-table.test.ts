import { HashTable } from "../../src/util/hash-table";
import { describe, beforeEach, it, expect } from "bun:test";

describe("HashTable", () => {
  let hashTable: HashTable;
  beforeEach(() => {
    hashTable = new HashTable();
  });

  describe("capacity", () => {
    it("should be 11 by default", () => {
      expect(hashTable.length).toEqual(11);
    });

    it("should be 22 after 8 insertions", () => {
      for (let i = 0; i < 8; i++) {
        hashTable.insert(i, i);
      }
      expect(hashTable.length).toEqual(22);
    });

    it("should shrink to 11 after 4 deletions", () => {
      for (let i = 0; i < 8; i++) {
        hashTable.insert(i, i);
      }
      for (let i = 0; i < 4; i++) {
        hashTable.delete(i);
      }
      expect(hashTable.length).toEqual(11);
    });
  });

  describe("insert", () => {
    it("should insert and retrieve elements correctly", () => {
      hashTable.insert("foo", "bar");
      expect(hashTable.find("foo")).toEqual("bar");
    });
  });

  describe("delete", () => {
    it("should delete elements correctly", () => {
      hashTable.insert("foo", "bar");
      hashTable.delete("foo");
      expect(hashTable.find("foo")).toEqual(undefined);
    });
  });
});
