#!/usr/bin/env node

var dispatcher = require('./dispatcher');

var arguments = process.argv.slice(2);

try{
	dispatcher.handle(arguments);
}catch(err){
	console.log(err);
}






