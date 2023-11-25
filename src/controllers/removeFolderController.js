const { fileService } = require('../services/remove/fileService');
const { folderService } = require('../services/remove/folderService');

router.delete('/folder', fileService);
router.delete('/file', folderService);

module.exports = router;