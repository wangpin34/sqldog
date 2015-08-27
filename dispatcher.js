var actions = require('./actions');


const INIT = 'init';
const CONFIG = 'config';
const EXEC = 'ex';
const EXEC_F = 'exf';
const STATUS = 'st';

//command pattern
var init = /^init$/,
	config = /^config$/,
	exec = /^exec ([\d\D]+.sql)$/,
	exec_f = /^exec -f ([\d\D]+.sql)$/,
	status = /^status$/;

var routes = [
	{pattern:init,action:INIT},
	{pattern:config,action:CONFIG},
	{pattern:exec,action:EXEC},
	{pattern:exec_f,action:EXEC_F},
	{pattern:status,action:STATUS}
];



function routing(cmdstr){

	for(var x in routes){
		if(routes[x].pattern.test(cmdstr)){
			var arr = routes[x].pattern.exec(cmdstr);
			var param = arr[1];
			return {action:routes[x].action,param:param};
		}
	}

	return {action:'',param:''};
}


exports.handle = function(cmd) {
		
	var cmdstr = cmd.join(' ');

	var route = routing(cmdstr);
	
	switch (route.action) {
		case INIT:
			actions.init();
			break;
		case CONFIG:
			actions.config();
			break;
		case EXEC:
			actions.execute(route.param);
			break;
		case EXEC_F:
			actions.executeforce(route.param);
			break;
		case STATUS:
			actions.getStatus();
			break;
		default:
			throw 'Not recognized command: ' + cmdstr;
	}
	
}