const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://localhost:5432/2405-fbt-et-web-pt",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };