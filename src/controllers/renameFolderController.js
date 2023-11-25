const { fileService } = require('../services/rename/fileService.js');
const { folderService } = require('../services/rename/folderService.js');

router.put('/file', fileService);
router.put('/folder', folderService);

module.exports = router;