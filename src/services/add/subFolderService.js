
const Folder = require('../../models/folder');

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
    
      if (!folderName) {
        return res.status(400).json({ error: 'Folder name is required' });
      }
  
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  

      const folderCheckQuery = 'SELECT * FROM folders WHERE parentfolder_id = $1 AND name = $2 AND user_id = $3';
      const folderCheckValues = [parentfolderId, folderName, userId];
      const folderCheckResult = await pool.query(folderCheckQuery, folderCheckValues);
  
      if (folderCheckResult.rows.length > 0) {
        return res.status(400).json({ error: 'Folder with the same name already exists for this user' });
      }

      let parentpath = `SELECT path FROM folders WHERE id=${parentfolderId}`;

      
      let newfolder = await Folder.create({folderName, root, userId, path:`xyz`});//setting a random path
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${parentpath}/folder_${newfolder.id}`, 
        Expires: 60, 
        ContentType: 'application/octet-stream', 
      };

    
      let path = s3Params.get(Key);
      newfolder = await Folder.create({folderName, parentfolderId, user_id, path});
  
      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
  
      res.status(201).json({ folder: newfolder, uploadUrl });
    } 
    catch (error) {
      console.error('Error creating folder :', error);
      res.status(500).json({ error: 'Internal Server Error', uploadUrl });
    }
  };
  
  module.exports = { folder };