
const Folder = require('../../models/folder');
const pool = require('../config/databse');

pool.query(`
  CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parentfolder_id INT NOT NULL,
    user_id INT NOT NULL,
    path VARCHAR NOT NULL
  )
`).then(() => console.log('Folder table created'));

const folder = async (req, res) => {
    const { folderName, userId} = req.body;
  
    try {
  
      if (!folderName) {
        return res.status(400).json({ error: 'Folder name is required' });
      }
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const folderCheckQuery = 'SELECT * FROM folders WHERE name = $1 AND user_id = $2';
      const folderCheckValues = [folderName, userId];
      const folderCheckResult = await pool.query(folderCheckQuery, folderCheckValues);
  
      if (folderCheckResult.rows.length > 0) {
        return res.status(400).json({ error: 'Folder with the same name already exists for this user' });
      }
      const root = 0;
      
      let newfolder = await Folder.create({folderName, root, userId, path:`xyz`});//setting a random path
      let path = `user_${userId}/folder_${newfolder.id}`;
      newfolder = pool.query(`UPDATE folders SET path = ${path} WHERE id = ${newfolder.id}`);
  
  
      
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `user_${userId}/folder_${newfolder.id}`, 
        Expires: 60, 
        ContentType: 'application/octet-stream', 
      };
  
      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
  
      res.status(201).json({ folder: newfolder, uploadUrl });
    } 
    catch (error) {
      console.error('Error creating folder :', error);
      res.status(500).json({ error: 'Internal Server Error', uploadUrl });
    }
  };
  
  module.exports = { folder };