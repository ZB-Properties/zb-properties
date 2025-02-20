const pool = require('../config/db');

const createPropertyTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      price DECIMAL,
      location VARCHAR(255),
      type VARCHAR(50),
      image_url TEXT,
      status VARCHAR(50) DEFAULT 'available',
      owner_id INTEGER REFERENCES users(id)
    );
  `);
};

createPropertyTable();

module.exports = pool;
