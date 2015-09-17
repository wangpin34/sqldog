var path = require('path');
var _ = require('underscore');

var ft = require('./fileutils');


//data file location
const CONF = path.join(path.dirname(process.argv[1]), './conf.json'); // store global config
const STATUS = path.join(process.cwd(), '.status'); // store sql status of current sqldog dir

var data = {},
	status = ft.readFile(STATUS, {}),
	conf = require(CONF);

data.conf = conf;
data.status = status;
data.status = data.status ? data.status : {
	sqlfiles: [],
	sqlfilemap: []
};

var main = {

	isInit: function() {
		return ft.isFileExist(STATUS);
	},

	syncStatus: function() {
		ft.updateFile(data.status, STATUS);
	},

	getConf: function() {
		return data.conf;
	},

	setConf: function(conf) {
		data.conf = conf;
		ft.updateFile(conf, CONF);
	},

	getStatus: function() {
		return data.status;
	},

	setStatus: function(status) {
		data.status = status;
		main.syncStatus();
	},

	getSqlfiles: function() {
		return data.status.sqlfiles;
	},

	setSqlfiles: function(sqlfiles) {
		data.status.sqlfiles = sqlfiles;
		main.syncStatus();
	},

	getSqlfilemap: function() {
		return data.status.sqlfilemap;
	},

	setSqlfilemap: function(sqlfilemap) {

		data.status.sqlfilemap = sqlfilemap;

		main.syncStatus();
	},

	untrackSqlfiles: function(files) {
		var sqlfiles = data.status.sqlfiles;
		for (var x in files) {
			for (var y in sqlfiles) {
				if (files[x] === sqlfiles[y].path) {
					sqlfiles.splice(y, 1);
				}
			}

		}
		main.syncStatus();
	},

	trackSqlfiles: function(files) {
		var sqlfiles = data.status.sqlfiles;
		for (var x in files) {
			var fileObj = exports.createSqlfileObj(files[x]);
			sqlfiles.push(fileObj);
		}
		main.syncStatus();
	},

	//list sql files in current work dir
	listSqlfiles: function() {
		return ft.listSqlfiles();
	},

	isExecuted: function(file) {

		for (var x in data.status.sqlfiles) {
			if (file === data.status.sqlfiles[x].name && data.status.sqlfiles[x].executed) {
				return true;
			}
		}

		return false;
	},

	isSqlfileWatched: function(file) {
		var sqlfiles = data.status.sqlfiles;
		for (var x in sqlfiles) {
			if (sqlfiles[x].name === sqlfile) {
				return true;
			}
		}
		return false;
	},


	createSqlfileObj: function(file) {
		var obj = ft.parse(file);
		return {
			name: obj.filename,
			path: obj.fullpath,
			executed: false
		}
	}
};

module.exports = main;
