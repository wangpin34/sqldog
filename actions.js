var child_process = require('child_process');
var util = require('util');
var _ = require('underscore');


var setup = require('./setup');
var data = require('./data');
var ft = require('./fileutils');

var conf = data.getConf();

var db = conf.db;
var host = db.host;
var port = db.port;
var user = db.user;
var password = db.password;
var cwd = process.cwd();


function executeSqlFiles(patharray, callback) {
	for (var x in patharray) {
		executeSqlFile(patharray[x], callback);
	}
}

function executeSqlFile(file, callback) {

	child_process.exec(util.format('mysql -h %s -u%s -p%s < %s', host, user, password, file), callback);

}

exports.init = function() {
	setup.init();
}

exports.config = function (){
	setup.config();
}


exports.getStatus = function() {
	var allSqlfiles = data.getSqlfiles();
	var uexnum = 0;
	var exnum = 0;
	var tnum = allSqlfiles.length;
	var unexecfile = [];
	for (var x in allSqlfiles) {
		if (allSqlfiles[x].executed) {
			exnum++;
		} else {
			uexnum++;
			unexecfile.push(allSqlfiles[x].name);
		}
	}
	console.log("\n >>> \n");
	console.log('total sql files: ' + tnum + '\n');
	console.log('executed sql files: ' + exnum + '\n');
	console.log('un executed sql files: ' + uexnum + '\n');
	for(var x in unexecfile){
		console.log('                      ' + unexecfile[x] + '\n');
	}
	
}


exports.execute = function(file,force) {
	
	var sqlfiles = [];

	if(!ft.isFileExist(file)){
		throw file + ' doesn\'t exist';
	}

	if(!data.isSqlfileWatched(file)){
		//add this file to status
		sqlfiles = data.getSqlfiles();
		var fileobj = data.createSqlfileObj(file);
		sqlfiles.push(fileobj);
	}


	if (data.isExecuted(file) && !force) throw file + ' is also executed. \nBut you can still execute it using : sqldog ex -f ' + file;

	executeSqlFile(file, function(err) {
		if (err) throw 'Error occuard when executed sql ' + file;
		sqlfiles = data.getSqlfiles();
		for (var x in sqlfiles) {
			var name = sqlfiles[x].name;
			if (name === file) {
				sqlfiles[x].executed = true;
				break;
			}
		}
		data.setSqlfiles(sqlfiles);
	});

}


/**
 * Detect files, and sync them with tracked files
 */
exports.walk = function(){
	var untracked = [],
		removed = [],
		exists = [],
		trackeds = data.getSqlfilemap(),
		sqlfiles = data.listSqlfiles();



	_.each(trackeds,function(tracked,index,list){

		if(_.indexOf(sqlfiles,tracked) === -1){
			removed.push(tracked);
		}

	});


	_.each(sqlfiles,function(sqlfile,index,list){

		if(_.indexOf(trackeds,sqlfile) === -1){
			untracked.push(sqlfile);
		}

	});

	if(removed.length>0){
		console.log(removed.join() + " removed!");
		data.untrackSqlfiles(removed);
	}	

	if(untracked.length>0){
		console.log(untracked.join() + " untracked!");
		data.trackSqlfiles(untracked);
	}

	if(removed.length == 0 && untracked.length == 0){
		console.log('\nNothing strange found, my master.');
	}

	data.setSqlfilemap(sqlfiles);	

}
