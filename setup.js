var prompt = require('prompt');
var path = require('path');

var data = require('./data');
var cwd = process.cwd();
var sep = path.sep;

exports.init = function(dir) {

	if(data.isInit()){
		throw 'Master, it is initialized previously.';
	}

	var sqlfiles = data.listSqlfiles();
	var status = {
		sqlfiles: []
	};

	for (var x in sqlfiles) {
		var pathname = sqlfiles[x],
			name = pathname.replace(cwd + sep, '');
		status.sqlfiles.push({
			name: name,
			path: pathname,
			executed: false
		});
	}

	data.setStatus(status);

}


exports.setDB = function() {

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

		conf.db.host = result.host;
		conf.db.port = result.port;
		conf.db.user = result.user;
		conf.db.password = result.password;

		//save db conf
		data.setConf(conf);

	});
}