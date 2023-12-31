
const Folder = require('../../models/folder');
const pool = require('../config/databse');



try{ if("SHOW TABLES LIKE folders"){
router.delete('/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
  
    try {
      
      const getFolderQuery = 'SELECT * FROM folders WHERE id = $1';
      const getFolderValues = [folderId];
      const folderData = await pool.query(getFolderQuery, getFolderValues);
  
      if (folderData.rows.length === 0) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      const { name, parent_id, user_id, path } = folderData.rows[0];
  
      // Delete the file from AWS S3
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${path}`, 
      };
  
      await s3.deleteObject(s3Params).promise();
  
      const deleteFolderQuery = 'DELETE FROM folders WHERE id = $1 RETURNING *';
      const deleteFolderValues = [folderId];
      const deletedFolder = await pool.query(deleteFileQuery, deleteFileValues);

      //removing data of all the files present in the folder 
      const subfiles = 'SELECT * FROM files WHERE folder_id = folderId';
      const deleteSubfiles = 'DELETE FROM files WHERE id IN $1 RETURNING *';
      const delfiles = [subfiles];
      const deletedSubFiles = await pool.query(deleteSubfiles, delfiles);
      for(let i = 0; i < deletedSubFiles.length(); i++){
        let s3Param = {
            Bucket: 'bucket_name',
            Key: `${i.path}`, 
          };
        await s3.deleteObject(s3Param).promise();
      }

      //removing data of sub folders in the deleted folder
      deleteSubFolders(parent_id)
      async function deleteSubFolders(folder_id){
        const subfolders = 'SELECT * FROM folders WHERE parentfolder_id = folderId';

        if(subfolders.length() != 0){
          //recursion
          for(let i = 0; i < subfolders.length(); i++){
            deleteSubFolders(subfolders[i].id);
          }
        }
        const deleteSubfolders = 'DELETE FROM folders WHERE id IN $1 RETURNING *';
        const delfolders = [subfolders];
        const deletedSubFolders = await pool.query(deleteSubfolders, delfolders);
        for(let i = 0; i < deletedSubFolders.length(); i++){
          let s3Param = {
            Bucket: 'bucket_name',
            Key: `${deletedSubFolders[i].path}`, 
            };
          await s3.deleteObject(s3Param).promise();
        }
        return;
      }

      res.status(200).json({ message: 'Folder deleted successfully', deletedFolder: deletedFolder.rows[0] });
    } 
    catch (error) {
      console.error('Error deleting folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
}
catch{
  res.status(400).json({message: "No such folder!"})
}

export default router;