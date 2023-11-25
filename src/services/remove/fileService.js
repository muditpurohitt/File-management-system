
const File = require('../../models/file');
const pool = require('../config/databse');


try{
   if(pool.query("SHOW TABLES LIKE files")){
    router.delete('/:fileId', async (req, res) => {
      const fileId = req.params.fileId;
    
      try {
        
        const getFileQuery = 'SELECT * FROM files WHERE id = $1';
        const getFileValues = [fileId];
        const fileData = await pool.query(getFileQuery, getFileValues);
    
        if (fileData.rows.length === 0) {
          return res.status(404).json({ error: 'File not found' });
        }
    
        const { name, folder_id, user_id, path } = fileData.rows[0];
    
        const s3Params = {
          Bucket: 'bucket_name',
          Key: `${path}`, 
        };
    
        await s3.deleteObject(s3Params).promise();
    
        const deleteFileQuery = 'DELETE FROM files WHERE id = $1 RETURNING *';
        const deleteFileValues = [fileId];
        const deletedFile = await pool.query(deleteFileQuery, deleteFileValues);
    
        res.status(200).json({ message: 'File deleted successfully', deletedFile: deletedFile.rows[0] });
      } 
      catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
   }
}
catch{
      return res.status(400).json({message : "Table does not exist"});
}

export default router;