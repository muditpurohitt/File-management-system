
const Folder = require('../../models/folder');
const pool = require('../config/databse');

//create the folders table if does not exist already 
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
      // Check if the folder name is provided
      if (!folderName) {
        return res.status(400).json({ error: 'Folder name is required' });
      }
  
      // Check if the user ID is provided
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      // Check if the folder name is unique for the user
      const folderCheckQuery = 'SELECT * FROM folders WHERE name = $1 AND user_id = $2';
      const folderCheckValues = [folderName, userId];
      const folderCheckResult = await pool.query(folderCheckQuery, folderCheckValues);
  
      if (folderCheckResult.rows.length > 0) {
        return res.status(400).json({ error: 'Folder with the same name already exists for this user' });
      }
      const root = 0;
      // Insert the new folder into the database, 0 is the id of root
      let path = `user_${userId}/folder_${newfolder.id}`;
      const newfolder = await Folder.create({folderName, root, userId, path});
  
      // Generate a pre-signed URL for file upload to S3
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `user_${userId}/folder_${newfolder.id}`, // Modify the Key as needed
        Expires: 60, // URL expiration time in seconds
        ContentType: 'application/octet-stream', // Set the content type based on your file type
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