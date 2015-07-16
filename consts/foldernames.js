module.exports = (function(){
    var USER_FOLDERNAME;
    if (process.platform === 'win32') {
        USER_FOLDERNAME = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
    } else {
        USER_FOLDERNAME = process.env.HOME || process.env.TMPDIR || '/tmp';
    }
    USER_FOLDERNAME = USER_FOLDERNAME.replace(/\\/g, '/') + '/';

    var DATA_FOLDERNAME = '.aproxy/';

    var PROJECT_FOLDERNAME = './';


    return {
        USER: USER_FOLDERNAME,
        DATA: DATA_FOLDERNAME,
        PROJECT: PROJECT_FOLDERNAME
    };
}());
