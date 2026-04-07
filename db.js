// db.js - Simple JSON-based database
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DB_PATH, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const db = {
  find: (collection, query = {}) => {
    const data = readCollection(collection);
    if (Object.keys(query).length === 0) return data;
    return data.filter(item =>
      Object.keys(query).every(key => item[key] === query[key])
    );
  },

  findOne: (collection, query) => {
    const data = readCollection(collection);
    return data.find(item =>
      Object.keys(query).every(key => item[key] === query[key])
    ) || null;
  },

  findById: (collection, id) => {
    const data = readCollection(collection);
    return data.find(item => item.id === id) || null;
  },

  insert: (collection, document) => {
    const data = readCollection(collection);
    data.push(document);
    writeCollection(collection, data);
    return document;
  },

  update: (collection, id, updates) => {
    const data = readCollection(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates };
    writeCollection(collection, data);
    return data[index];
  },

  delete: (collection, id) => {
    const data = readCollection(collection);
    const filtered = data.filter(item => item.id !== id);
    writeCollection(collection, filtered);
    return filtered.length < data.length;
  },

  deleteMany: (collection, query) => {
    const data = readCollection(collection);
    const filtered = data.filter(item =>
      !Object.keys(query).every(key => item[key] === query[key])
    );
    writeCollection(collection, filtered);
  }
};

module.exports = db;
