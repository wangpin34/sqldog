var actions = require('./actions');


const INIT = 'init';
const EXEC = 'ex';
const EXEC_F = 'exf';
const STATUS = 'st';
const UPDATE = 'up';

//command pattern
var init = /^init$/,
	exec = /^exec ([\d\D]+.sql)$/,
	exec_f = /^exec -f ([\d\D]+.sql)$/,
	status = /^status$/,
	update = /^update$/;

var routes = [
	{pattern:init,action:INIT},
	{pattern:exec,action:EXEC},
	{pattern:exec_f,action:EXEC_F},
	{pattern:status,action:STATUS},
	{pattern:update,action:UPDATE}
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
		case EXEC:
			actions.execute(route.param);
			break;
		case EXEC_F:
			actions.executeforce(route.param);
			break;
		case UPDATE:
			actions.update();
			break;
		case STATUS:
			actions.getStatus();
			break;
		default:
			throw 'Not recognized command: ' + cmdstr;
	}
	
}