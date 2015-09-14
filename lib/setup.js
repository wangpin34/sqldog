var prompt = require('prompt');
var path = require('path');

var data = require('./data');
var cwd = process.cwd();
var sep = path.sep;

const SQL_ST_DEFAULT = false;

exports.init = function(sqlStatus) {

	if(data.isInit()){
		throw 'Master, it is initialized already previously.';
	}

	var sqlfiles = data.listSqlfiles();
	var status = {
		sqlfiles: [],
		sqlfilemap:sqlfiles
	};
	
	if(!sqlStatus) sqlStatus = SQL_ST_DEFAULT;

	for (var x in sqlfiles) {
		var pathname = sqlfiles[x],
			name = pathname.replace(cwd + sep, '');
		status.sqlfiles.push({
			name: name,
			path: pathname,
			executed: sqlStatus
		});
	}

	data.setStatus(status);

}


exports.config = function() {

	var conf = data.getConf();

	prompt.start();

	if (!conf.db) {
		conf.db = {
			type: "mysql",
			host: "localhost",
			port: "3306",
			user: "root",
			password: "passwd",
		};
	}

	var schema = {
		properties: {
			host: {
				description: 'Database Host',
				default: conf.db.host
			},
			port: {
				description: 'Database Port',
				type: 'number',
				message: 'Port should be a number',
				default: conf.db.port
			},
			user: {
				description: 'Username',
				default: conf.db.user
			},
			password: {
				description: 'Password',
				default: conf.db.password
			}
		}
	};

	prompt.get(schema, function(err, result) {

		if(result){
			conf.db.host = result.host ? result.host : conf.db.host;
			conf.db.port = result.port ? result.port : conf.db.host;
			conf.db.user = result.user ? result.user : conf.db.host;
			conf.db.password = result.password ? result.password : conf.db.password;

			//save db conf
			data.setConf(conf);
		}

	});
}