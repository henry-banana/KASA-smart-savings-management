import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load fixture data from JSON file
 */
function loadFixture(filename) {
  const filepath = join(__dirname, filename);
  const data = readFileSync(filepath, "utf-8");
  return JSON.parse(data);
}

// Export all fixtures
export const fixtures = {
  customers: loadFixture("customers.json"),
  // employees: loadFixture("employees.json"),
  // savingbooks: loadFixture("savingbooks.json"),
  // transactions: loadFixture("transactions.json"),
};

/**
 * Get a single fixture by name and optional id
 */
export function getFixture(type, id = null) {
  const data = fixtures[type];

  if (!data) {
    throw new Error(`Fixture type '${type}' not found`);
  }

  if (id === null) {
    return data;
  }

  // Find by id (works for customerid, employeeid, bookid, transactionid)
  const idField = `${type.slice(0, -1)}id`; // customers -> customerid
  return data.find((item) => item[idField] === id) || null;
}

/**
 * Get multiple fixtures by ids
 */
export function getFixtures(type, ids) {
  const data = fixtures[type];

  if (!data) {
    throw new Error(`Fixture type '${type}' not found`);
  }

  const idField = `${type.slice(0, -1)}id`;
  return data.filter((item) => ids.includes(item[idField]));
}

/**
 * Get random fixture
 */
export function getRandomFixture(type) {
  const data = fixtures[type];

  if (!data || data.length === 0) {
    throw new Error(`No fixtures found for type '${type}'`);
  }

  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

/**
 * Clone fixture with modifications
 */
export function cloneFixture(type, id, modifications = {}) {
  const original = getFixture(type, id);

  if (!original) {
    throw new Error(`Fixture not found: ${type} with id ${id}`);
  }

  return {
    ...original,
    ...modifications,
  };
}

export default fixtures;
