var fs = require('fs');
var path = require('path');


var listSqlExcape  = ['node_modules','.git'];


var encodeJson = function(data) {
    return JSON.stringify(data, null, 2);
}

function inArray(array,obj){
    var exist = false;
    for(var x in array){
        if( array[x] === obj){
            exist = true;
            break;
        }
    }

    return exist;
}

function listSqlfiles(dir) {
    if (!dir) var dir = process.cwd();
    var files = [];

    if(inArray(listSqlExcape,path.basename(dir))) return [];

    fs.readdirSync(dir).forEach(function(file) {
        var pathname = path.join(dir, file);
        
        if (fs.statSync(pathname).isDirectory()) {
            var subfiles = listSqlfiles(pathname);
            Array.prototype.push.apply(files,subfiles);
        } else {
            if (/.sql$/.test(pathname)) {
                files.push(pathname);
            }
        }
    });
    return files;
}


exports.listSqlfiles = listSqlfiles;

exports.updateFile = function(data, des) {
    fs.writeFileSync(des, encodeJson(data));
}

exports.readFile = function(des) {
    if(!fs.existsSync(des)){
        return null;
    }
    return JSON.parse(fs.readFileSync(des, 'utf-8'));
}

exports.isFileExist = function(pathname){
    if(path.isAbsolute(pathname)){
        return fs.existsSync(pathname);
    }else{
        return fs.existsSync(path.join(process.cwd(),pathname));
    }
}

exports.parse = function(pathname){
    var filename = '',
        dirname = '';
    if(path.isAbsolute(pathname)){
        filename = path.basename(pathname);
        dirname = path.dir(pathname);
    }else{
        filename = pathname;
        dirname = process.cwd();
    }

    return {filename:filename,dirname:dirname}
}