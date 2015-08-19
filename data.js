var path = require('path');
var ft = require('./fileutils');

//data file localcation
const CONF = './conf.json'; // store global conf constains db config
const STATUS = path.join(process.cwd(), '.status'); // store sql status of current sqldog dir

var data = {};

data.conf = require(CONF);
data.status = ft.readFile(STATUS, {});
data.status = data.status != null ? data.status : {
	sqlfiles: []
};


function isSqlfileWatched (sqlfile){
	var sqlfiles = data.status.sqlfiles;
	for(var x in sqlfiles){
		if(sqlfiles[x].name === sqlfile){
			return true;
		}
	}	
	return false;
}

exports.isInit = function(){
	return ft.isFileExist(STATUS);
}

exports.getConf = function() {
	return data.conf;
}

exports.setConf = function(conf) {
	data.conf = conf;
	ft.updateFile(conf, CONF);
}

exports.getStatus = function() {
	return data.status;
}

exports.setStatus = function(status) {
	data.status = status;
	ft.updateFile(data.status, STATUS)
}

exports.getSqlfiles = function() {
	return data.status.sqlfiles;
}

exports.setSqlfiles = function(sqlfiles) {
	data.status.sqlfiles = sqlfiles;
	ft.updateFile(data.status, STATUS);
}

//list sql files in current work dir
exports.listSqlfiles = function() {
	return ft.listSqlfiles();
}

exports.isExecuted = function(file) {

	for (var x in data.status.sqlfiles) {
		if (file === data.status.sqlfiles[x].name && data.status.sqlfiles[x].executed) {
			return true;
		}
	}

	return false;
}

exports.isSqlfileWatched = function(file){
	
	return isSqlfileWatched(file);
}


exports.createSqlfileObj = function(file) {

	var obj = ft.parse(file);
	return {
		name: obj.filename,
		path: obj.pathname,
		executed: false
	}
}