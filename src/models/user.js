// src/models/user.js
const pool = require('../config/database');

class User {
  static async create({ username, email, password }) {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, password];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;
