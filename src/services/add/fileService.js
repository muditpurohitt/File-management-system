
const File = require('../../models/file');
const pool = require('../config/databse');
//create the files table if does not exist already 
pool.query(`
  CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    folder_id INT NOT NULL,
    user_id INT NOT NULL,
    path VARCHAR NOT NULL
  )
`).then(() => console.log('File table created'));

const file = async (req, res) => {
    const {parentfolderId, fileName, userId } = req.body;
  
    try {
      // Check if the folder name is provided
      if (!parentfolderId) {
        return res.status(400).json({ error: 'Parent folder is required' });
      }
  
      // Check if the user ID is provided
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Check if filename is provided
      if (!fileName) {
        return res.status(400).json({ error: 'File name is required' });
      }
  
      // Check if the folder name is unique for the user
      const fileCheckQuery = 'SELECT * FROM files WHERE name = $2 AND folder_id = $1 AND user_id = $3';
      const fileCheckValues = [parentfolderId, fileName, userId];
      const fileCheckResult = await pool.query(folderCheckQuery, folderCheckValues);
  
      if (fileCheckResult.rows.length > 0) {
        return res.status(400).json({ error: 'File in the given folder with the same name already exists for this user' });
      }
      
      //geting the parent path
      const parentPath = pool.query('SELECT path FROM folders WHERE id = parentfolderId');

      // Generate a pre-signed URL for file upload to S3
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${parentPath}/${fileName}`, 
        Expires: 60, // URL expiration time in seconds
        ContentType: 'application/octet-stream',
      };
  
      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
  
      // Insert the new file into the database
      let path = `${parentPath}/${fileName}`;
      const newfile = await File.create({fileName, parentfolderId, userId, path});
  
      res.status(201).json({file: newfile, uploadUrl });
    } 
    catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = { file };