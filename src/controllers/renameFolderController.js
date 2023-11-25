const { fileService } = require('../services/rename/fileService.js');
const { folderService } = require('../services/rename/folderService.js');
const { subfolderService } = require('../services/rename/subFolderService.js');

router.put('/folder', fileService);
router.put('/file', folderService);

module.exports = router;