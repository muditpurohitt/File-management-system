const { fileService } = require('../services/remove/fileService');
const { folderService } = require('../services/remove/folderService');

router.delete('/file', fileService);
router.delete('/folder', folderService);

module.exports = router;