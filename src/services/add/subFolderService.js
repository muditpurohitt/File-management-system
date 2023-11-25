
const Folder = require('../../models/folder');

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
    const { parentfolderId, folderName, userId} = req.body;
  
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
      const folderCheckQuery = 'SELECT * FROM folders WHERE parentfolder_id = $1 AND name = $2 AND user_id = $3';
      const folderCheckValues = [parentfolderId, folderName, userId];
      const folderCheckResult = await pool.query(folderCheckQuery, folderCheckValues);
  
      if (folderCheckResult.rows.length > 0) {
        return res.status(400).json({ error: 'Folder with the same name already exists for this user' });
      }

      //getting parent path
      let parentpath = 'SELECT path FROM folders WHERE id=parentfolderId';

      // Generate a pre-signed URL for file upload to S3
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${parentpath}/folder_${newfolder.id}`, // Modify the Key as needed
        Expires: 60, // URL expiration time in seconds
        ContentType: 'application/octet-stream', // Set the content type based on your file type
      };

      // Insert the new folder into the database
      let path = s3Params.get(Key);
      const newfolder = await Folder.create({folderName, parentfolderId, user_id, path});
  
      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
  
      res.status(201).json({ folder: newfolder, uploadUrl });
    } 
    catch (error) {
      console.error('Error creating folder :', error);
      res.status(500).json({ error: 'Internal Server Error', uploadUrl });
    }
  };
  
  module.exports = { folder };