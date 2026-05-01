
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.resolve(__dirname, "../data/db.json");

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ movie: [], favorite: [] }, null, 2));
  }
}

function readAll() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return { movie: [], favorite: [] };
  }
}

function writeAll(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function matchesFilter(item, filter) {
  if (!filter || typeof filter !== "object") return true;
  return Object.entries(filter).every(([k, v]) => {
    if (v === undefined || v === null || v === "") return true;
    return String(item[k]) === String(v);
  });
}

class JsonDao {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }

  _collection(db) {
    if (!db[this.schemaName]) db[this.schemaName] = [];
    return db[this.schemaName];
  }

  create(uuObject) {
    const db = readAll();
    const coll = this._collection(db);
    const obj = { id: uuidv4(), ...uuObject, createdAt: new Date().toISOString() };
    coll.push(obj);
    writeAll(db);
    return obj;
  }

  get(filter) {
    const db = readAll();
    const coll = this._collection(db);
    return coll.find((it) => matchesFilter(it, filter)) || null;
  }

  list(pageInfo = {}) {
    const pageIndex = Number.isInteger(pageInfo.pageIndex) ? pageInfo.pageIndex : 0;
    const pageSize = Number.isInteger(pageInfo.pageSize) ? pageInfo.pageSize : 100;
    const filter = pageInfo.filter || {};

    const db = readAll();
    const coll = this._collection(db).filter((it) => matchesFilter(it, filter));

    const start = pageIndex * pageSize;
    const itemList = coll.slice(start, start + pageSize);
    return {
      itemList,
      pageInfo: { pageIndex, pageSize, total: coll.length },
    };
  }

  update(object) {
    if (!object || !object.id) return null;
    const db = readAll();
    const coll = this._collection(db);
    const idx = coll.findIndex((it) => it.id === object.id);
    if (idx === -1) return null;
    coll[idx] = { ...coll[idx], ...object, updatedAt: new Date().toISOString() };
    writeAll(db);
    return coll[idx];
  }

  delete(id) {
    if (!id) return;
    const db = readAll();
    const coll = this._collection(db);
    const idx = coll.findIndex((it) => it.id === id);
    if (idx === -1) return;
    coll.splice(idx, 1);
    writeAll(db);
  }
}

module.exports = JsonDao;
