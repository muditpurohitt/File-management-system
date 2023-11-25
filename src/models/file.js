const pool = require('../config/database');

class File {
  static async create({ name, folder_id, user_id, path }) {
    const query = 'INSERT INTO files (name, folder_id, user_id, path) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, folder_id, user_id, path];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = File;