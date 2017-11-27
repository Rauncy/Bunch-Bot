"use strict";

const CMD_DELIMITER = "$";
var prompts = {};
var commands = {};

/*
Name is the name the command will run under
Run is the function that will run when executed, paramaters are the message object and space separated array of words after command
*/
function addCommand(name, run){
  if(prompts[`${CMD_DELIMITER}${name}`] = commands.length;
  commands.push(run);
}

/*
Message is the message object in which a command is executed
*/
function runCommand(message){
  while(){

  }
}

function separateParams(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){

  }else return undefined;
}

addCommand("help", message => {

});
