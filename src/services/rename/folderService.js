const Folder = require('../../models/folder');

pool.query(`
  CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parentfolder_id INT NOT NULL,
    user_id INT NOT NULL
  )
`).then(() => console.log('Folder table created'));


// Function to recursively update paths of subfiles and subfolders
// async function updatePathsRecursively(folderId, userId, oldFolderName, newFolderName, parentpath) {
//     try {
//       // Update subfolders
//       const updateSubfoldersQuery = `
//         UPDATE folders
//         SET name = REPLACE(name, $1, $2)
//         WHERE user_id = $3 AND parent_folder_id = $4
//       `;
//       const updateSubfoldersValues = [oldFolderName, newFolderName, userId, folderId];
//       await pool.query(updateSubfoldersQuery, updateSubfoldersValues);
  
//       // Update subfiles
//       const updateSubfilesQuery = `
//         UPDATE files
//         SET path = REPLACE(path, $1, $2)
//         WHERE user_id = $3 AND folder_id = $4
//       `;
//       const updateSubfilesValues = [oldFolderName, newFolderName, userId, folderId];
//       await pool.query(updateSubfilesQuery, updateSubfilesValues);
//     } 
//     catch (error) {
//       throw new Error(`Error updating paths recursively: ${error.message}`);
//     }
//   }
  
  try{if("SHOW TABLES LIKE files"){
  router.put('/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    const { newFolderName } = req.body;
  
    try {
      if (!newFolderName) {
        return res.status(400).json({ error: 'New folder name is required' });
      }
  
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
  
      
      let parentpath = pool.query('SELECT path FROM folders WHERE parentfolder_id = parentfolder_id')
      let s3Params = {
        Bucket: 'bucket_name',
        Key: `${parentpath}/${newFolderName}`, 
      };
  
      
      await s3.copyObject({ ...s3Params, CopySource: `${s3Params.Bucket}/${s3Params.Key}` }).promise();
      await s3.deleteObject(s3Params).promise();
  
      //updating path of all the files present in the folder 
      const subfiles = 'SELECT * FROM files WHERE folder_id = folderId';
      const updateSubfiles = `UPDATE files SET path = ${parentpath}/${folderData.id}/${files.name} WHERE id IN $1 RETURNING *`;
      const renamefiles = [subfiles];
      const renamedSubFiles = await pool.query(updateSubfiles, renamefiles);
      for(let i = 0; i < renamedSubFiles.length(); i++){
        s3Param = {
            Bucket: 'bucket_name',
            Key: `${renamedSubFiles[i].path}`, 
          };
          await s3.copyObject({ ...s3Params, CopySource: `${s3Params.Bucket}/${s3Params.Key}` }).promise();
          await s3.deleteObject(s3Params).promise();
      }

      //updating path of sub folders in the rename folder using recursion
      renameSubFolders(parent_id)
      async function deleteSubFolders(folder_id){
        const subfolders = 'SELECT * FROM folders WHERE parentfolder_id = folderId';

        if(subfolders.length() != 0){
          //recursion
          for(let i = 0; i < subfolders.length(); i++){
            renameSubFolders(subfolders[i].id);
          }
        }
        const renamedSubfolders = `UPDATE files SET path = ${parentpath}/${folderData.id}/${files.name} WHERE id IN $1 RETURNING *`;
        const renfolders = [subfolders];
        const renamedSubFolders_final = await pool.query(renamedSubfolders, renfolders);
        for(let i = 0; i < renamedSubFolders_final.length(); i++){
          s3Param = {
            Bucket: 'bucket_name',
            Key: `${renamedSubFolders_final[i].path}`, 
            };
            await s3.copyObject({ ...s3Params, CopySource: `${s3Params.Bucket}/${s3Params.Key}` }).promise();
            await s3.deleteObject(s3Params).promise();
        }
        return;
      }

      res.status(200).json({ message: 'Folder renamed successfully', updatedFolder: updatedFolder.rows[0] });
    } catch (error) {
      console.error('Error renaming folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
}
catch{
  res.status(400).json({message: "No such folder!"});
}

  module.exports = router;