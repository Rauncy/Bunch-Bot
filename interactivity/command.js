"use strict";

const CMD_DELIMITER = "$";
exports.DELIMITER = CMD_DELIMITER;

var commands = {};

/*
Name is the name the command will run under
Run is the function that will run when executed, paramaters are the message object and space separated array of words after command
*/
function addCommand(name, run){
  if(!commands[name]) commands[name] = run;
}

/*
Message is the message object in which a command is executed
*/
/*
exports.runCommand = function(message){
  //Find command
  let tContent = message.content.split(" ");
  tContent[0] = tContent[0].substring(CMD_DELIMITER.length);
  var cur = commands;
  do{
    if(cur[])
  }while();
};
*/

exports.separateParams = function(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){
    //Process params
  }else return undefined;
};

exports.list = function(){
  return Object.keys(commands);
};

//Commands after this line
addCommand("help", message => {
  message.channel.send("The command interface works <@" + message.author + ">");
});
addCommand("perms", message => {
});
