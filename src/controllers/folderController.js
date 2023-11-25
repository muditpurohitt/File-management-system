const { fileService } = require('../services/add/fileService');
const { folderService } = require('../services/add/folderService');
const { subfolderService } = require('../services/add/subFolderService');

const rseponse = null;

if(!req.body.folderName ){
    response = fileService(req);
}
else{
    if(!req.body.parentfolderId){
        response = folderService(req);
    }
    else{
        response = subfolderService(req);
    }
}
export default response;