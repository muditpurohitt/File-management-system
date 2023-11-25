const pool = require('../config/database');

class Folder {
  static async create({ name, parentfolder_id, user_id, path }) {
    const query = 'INSERT INTO folders (name, parentfolder_id, user_id, path) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, parentfolder_id, user_id, path];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Folder;