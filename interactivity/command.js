"use strict";

const CMD_DELIMITER = "$";
const HELP_DATA = {
  help : "Tells you how to use commands. If you are seeing this you know how to use this command.",
  perms : "Allows modification of permissions within the bot.",
  ifeven : "Tests if a number is even or not because I can't use CJ's bot :("
};
exports.DELIMITER = CMD_DELIMITER;

var commands = {};

/*
Name is the name the command will run under
Run is the function that will run when executed, paramaters are specified by next variable
Param is the way the paramaters will be separated and passed to the function represented as a regex
*/
function addCommand(name, param, run){
  if(!commands[name]){
    commands[name] = {};
    commands[name].run = run;
    commands[name].param = param;
  }
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

/*
String guide:
S: String of rest of command, always last
C: First character of next word
W: Next word
*/
function separateParams(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){
    //Process params
    text = text.substring(cmd.length+2);
    let list = commands[cmd].param;
    let params = [];
    while(list.charAt(0).toLowerCase()!="s" && text.length>0){
      console.log(`L: ${list} P: ${params.join(", ")} T: ${text}`);
      switch(list.charAt(0).toLowerCase()){
        case "c":
          params.push(text.charAt(0));
          break;
        case "w":
          if(text.includes(" ")) params.push(text.substring(0, text.indexOf(" ")));
          else params.push(text);
          break;
        default:
          break;
      }
      if(text.includes(" ")) text = text.substring(text.indexOf(" ")+1);
      else text = "";

      list = list.substring(1);
    }
    if(text.length>0) params.push(text);
    return params;
  }else return undefined;
};

exports.list = function(){
  return Object.keys(commands);
};

exports.runCommand = function(name, message){
  if(commands[name]) commands[name].run(message, separateParams(name, message.content));
};

//Commands after this line
addCommand("help", "s", (message, params) => {
  if(exports.list().includes(params[0])){
    message.channel.send(params[0].toUpperCase() + ": " + HELP_DATA[params[0].toLowerCase()]);
  }else{
    message.channel.send("\"" + params[0] + "\" is not a command, type \"list\" for all default commands!");
  }
});
addCommand();
addCommand("perms", "s", (message, params) => {
});
addCommand("ifeven", "ws", (message, params) => {
  if(/\d/ig.test(params[0])){
    params[0] = parseInt(params[0]);
    message.channel.send(params[0] + " " + (params[0]%2==0 ? "is" : "isn't") + " even!");
  }else message.reply("I can't fucking even. Just put a number in...");
});
addCommand("relay", "ws", (message, params) => {
  //message.client.channels.get(params[0]).send(params[1]);
  params[0] = params[0].substring(2, 20);
  message.client.channels.get(params[0]).send(params[1]);
});
