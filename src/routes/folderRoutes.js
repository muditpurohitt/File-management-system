const express = require('express');
const router = express.Router();
const { folderController } = require('../controllers/folderController');
const { authenticateJwt } = require("../middleware/authMiddleware");

router.post('/add', authenticateJwt, folderController);
router.put('/update', authenticateJwt, updateFolderController);
router.delete('/remove', authenticateJwt, removeFolderController);

module.exports = router;

// body structure -> [
//     parentfolderId,
//     folderName,
//     fileName,
//     user_id
// ]