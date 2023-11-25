const File = require('../../models/file');
const pool = require('../config/databse');

try{if("SHOW TABLES LIKE files"){
router.put('/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
    const { newFileName } = req.body;
  
    try {
      
      if (!newFileName) {
        return res.status(400).json({ error: 'New file name is required' });
      }
  
      
      const getFileQuery = 'SELECT * FROM files WHERE id = $1';
      const getFileValues = [fileId];
      const fileData = await pool.query(getFileQuery, getFileValues);
  
      if (fileData.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const { name, folder_id, user_id, path } = fileData.rows[0];
  
      const updateFileQuery = 'UPDATE files SET name = $1 WHERE id = $2 RETURNING *';
      const updateFileValues = [newFileName, fileId];
      const updatedFile = await pool.query(updateFileQuery, updateFileValues);
  
      let parentpath = pool.query(`SELECT path from folders WHERE id=${folder_id}`);
      const s3Params = {
        Bucket: 'your-s3-bucket-name',
        Key: `${parentpath}/${newFileName}`, 
      };
  
      // Use the copy operation to rename the file in S3
      await s3.copyObject({ ...s3Params, CopySource: `${s3Params.Bucket}/${s3Params.Key}` }).promise();
      await s3.deleteObject(s3Params).promise();
  
      res.status(200).json({ message: 'File renamed successfully', updatedFile: updatedFile.rows[0] });
    } catch (error) {
      console.error('Error renaming file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
}
catch{
  res.status(400).json({message: "No such file!"});
}
  module.exports = router;