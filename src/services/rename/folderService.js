const Folder = require('../../models/folder');

//create the files table if does not exist already 
//create the folders table if does not exist already 
pool.query(`
  CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parentfolder_id INT NOT NULL,
    user_id INT NOT NULL
  )
`).then(() => console.log('Folder table created'));


// Function to recursively update paths of subfiles and subfolders
async function updatePathsRecursively(folderId, userId, oldFolderName, newFolderName, parentpath) {
    try {
      // Update subfolders
      const updateSubfoldersQuery = `
        UPDATE folders
        SET name = REPLACE(name, $1, $2)
        WHERE user_id = $3 AND parent_folder_id = $4
      `;
      const updateSubfoldersValues = [oldFolderName, newFolderName, userId, folderId];
      await pool.query(updateSubfoldersQuery, updateSubfoldersValues);
  
      // Update subfiles
      const updateSubfilesQuery = `
        UPDATE files
        SET path = REPLACE(path, $1, $2)
        WHERE user_id = $3 AND folder_id = $4
      `;
      const updateSubfilesValues = [oldFolderName, newFolderName, userId, folderId];
      await pool.query(updateSubfilesQuery, updateSubfilesValues);
    } 
    catch (error) {
      throw new Error(`Error updating paths recursively: ${error.message}`);
    }
  }
  
  // API endpoint to rename a folder
  router.put('/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    const { newFolderName } = req.body;
  
    try {
      // Check if the new folder name is provided
      if (!newFolderName) {
        return res.status(400).json({ error: 'New folder name is required' });
      }
  
      // Retrieve folder metadata from the database
      const getFolderQuery = 'SELECT * FROM folders WHERE id = $1';
      const getFolderValues = [folderId];
      const folderData = await pool.query(getFolderQuery, getFolderValues);
  
      if (folderData.rows.length === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      const { name, parentfolder_id, user_id, path } = folderData.rows[0];
  
      // Update folder metadata in the database
      const updateFolderQuery = 'UPDATE folders SET name = $1 WHERE id = $2 RETURNING *';
      const updateFolderValues = [newFolderName, folderId];
      const updatedFolder = await pool.query(updateFolderQuery, updateFolderValues);
  
      // If the S3 object key includes the folder name, update it in AWS S3
      let parentpath = pool.query('SELECT path FROM folders WHERE parentfolder_id = parentfolder_id')
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${parentpath}/${newFolderName}`, 
      };
  
      // Use the copy operation to rename the folder in S3
      await s3.copyObject({ ...s3Params, CopySource: `${s3Params.Bucket}/${s3Params.Key}` }).promise();
      await s3.deleteObject(s3Params).promise();
  
      // Update paths of subfiles and subfolders recursively
      await updatePathsRecursively(folderId, user_id, name, newFolderName, parentpath);

      res.status(200).json({ message: 'Folder renamed successfully', updatedFolder: updatedFolder.rows[0] });
    } catch (error) {
      console.error('Error renaming folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;