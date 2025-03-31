import { openDB } from "idb";

const promise = openDB("microtab", 1, {
  upgrade(db) {
    db.createObjectStore("key_value");
  },
});

export default function db() {}

db.get = async (key: string) => (await promise).get("key_value", key);
db.set = async (key: string, value: any) => (await promise).put("key_value", value, key);
