
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


router.delete('/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
  
    try {
      // Retrieve file metadata from the database
      const getFileQuery = 'SELECT * FROM files WHERE id = $1';
      const getFileValues = [fileId];
      const fileData = await pool.query(getFileQuery, getFileValues);
  
      if (fileData.rows.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const { name, folder_id, user_id, path } = fileData.rows[0];
  
      // Delete the file from AWS S3
      const s3Params = {
        Bucket: 'bucket_name',
        Key: `${path}`, 
      };
  
      await s3.deleteObject(s3Params).promise();
  
      // Remove file metadata from the database
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

  module.exports = router;