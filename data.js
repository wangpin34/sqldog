var path = require('path');
var _ = require('underscore');

var ft = require('./fileutils');


//data file localcation
const CONF = path.join(path.dirname(process.argv[1]),'./conf.json') ; // store global config
const STATUS = path.join(process.cwd(), '.status'); // store sql status of current sqldog dir

var data = {};

data.conf = require(CONF);
data.status = ft.readFile(STATUS, {});
data.status = data.status != null ? data.status : {
	sqlfiles: [],
	sqlfilemap: []
};


function updateStatus(){
	ft.updateFile(data.status, STATUS)
}

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
	updateStatus();
}

exports.getSqlfiles = function() {
	return data.status.sqlfiles;
}

exports.setSqlfiles = function(sqlfiles) {
	data.status.sqlfiles = sqlfiles;
	updateStatus();
}

exports.getSqlfilemap = function(){
	return data.status.sqlfilemap;
}

exports.setSqlfilemap = function(sqlfilemap){

	data.status.sqlfilemap = sqlfilemap;

	updateStatus();
}

exports.untrackSqlfiles = function(files){
	var sqlfiles = data.status.sqlfiles;
	for(var x in files){
		for(var y in sqlfiles){
			if(files[x] === sqlfiles[y].path){
				sqlfiles.splice(y,1);
			}
		}
		
	}
	updateStatus();
}

exports.trackSqlfiles = function(files){
	var sqlfiles = data.status.sqlfiles;
	for(var x in files){
		var fileObj = exports.createSqlfileObj(files[x]);
		sqlfiles.push(fileObj);
	}
	updateStatus();
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
		path: obj.fullpath,
		executed: false
	}
}