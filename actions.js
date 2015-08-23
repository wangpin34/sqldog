var child_process = require('child_process');
var util = require('util');


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

function update(){
	var sqlfiles = data.listSqlfiles();
}

exports.init = function() {
	setup.init();
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


exports.execute = function(file) {
	
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


	if (data.isExecuted(file)) throw file + ' is also executed. \nBut you can still execute it using : sqldog ex -f ' + file;

	executeSqlFile(file, function(err) {
		if (err) throw 'Error occuard when executed sql ' + file;
		sqlfiles = data.getSqlfiles();
		for (var x in sqlfiles) {
			var name = sqlfiles[x].name;
			if (name === file) {
				sqlfiles[x].executed = true;
				break
			}
		}
		data.setSqlfiles(sqlfiles);
	});

}

exports.update = update;