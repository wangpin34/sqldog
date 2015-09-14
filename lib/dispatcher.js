var actions = require('./actions');


const INIT = 'init';
const INIT_SE = 'init_se';
const CONFIG = 'config';
const EXEC = 'ex';
const EXEC_F = 'exf';
const STATUS = 'st';
const WALK = 'walk';

//command pattern
var init = /^init$/,
	init_se = /^init -se$/,
	config = /^config$/,
	exec = /^exec ([\d\D]+.sql)$/,
	exec_f = /^exec -f ([\d\D]+.sql)$/,
	status = /^status$/,
	walk = /^walk$/;

var routes = [
	{pattern:init,action:INIT},
	{pattern:init_se,action:INIT_SE},
	{pattern:config,action:CONFIG},
	{pattern:exec,action:EXEC},
	{pattern:exec_f,action:EXEC_F},
	{pattern:status,action:STATUS},
	{pattern:walk,action:WALK}
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
		case INIT_SE:
			actions.initse();
			break;
		case CONFIG:
			actions.config();
			break;
		case EXEC:
			actions.execute(route.param);
			break;
		case EXEC_F:
			actions.execute(route.param,true);
			break;
		case STATUS:
			actions.getStatus();
			break;
		case WALK:
			actions.walk();
			break;
		default:
			throw 'Not recognized command: ' + cmdstr;
	}
	
}