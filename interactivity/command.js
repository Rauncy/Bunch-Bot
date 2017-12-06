"use strict";

const CMD_DELIMITER = "$";
exports.DELIMITER = CMD_DELIMITER;

exports.commands = {};

/*
Name is the name the command will run under
Run is the function that will run when executed, paramaters are the message object and space separated array of words after command
*/
function addCommand(name, run){
  if(!exports.commands[name]) exports.commands[name] = (run);
}

/*
Message is the message object in which a command is executed
*/
exports.runCommand = function(message){
}

exports.separateParams = function(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){
    //Process params
  }else return undefined;
}

addCommand("help", message => {
  message.channel.send("The command interface works <@" + message.author + ">");
});
addCommand("perms", message => {
});
