"use strict";

const fs = require('fs');

const CMD_DELIMITER = "$";
const HELP_DATA = {
  help : {
    desc : "Tells you how to use commands. If you are seeing this you know how to use this command.",
    synt : ["Command Name"]
  },
  perms : {
    desc : "Allows modification of permissions within the bot.",
    synt : ["Function", "Target", "Command"]
  },
  ifeven : {
    desc : "Tests if a number is even or not because I can't use CJ's bot :(",
    synt : ["Number"]
  }
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
    if(list.charAt(0)=='s'){
      if(text.length>0) params.push(text);
      else params.push(" ");
    }
    return params;
  }else return undefined;
};

exports.list = function(){
  return Object.keys(commands);
};

exports.runCommand = function(name, message){
  var pars = separateParams(name, message.content);
  if(commands[name]){
    if(pars[commands[name].param.length-1]){
      commands[name].run(message, separateParams(name, message.content));
    }else{
      message.channel.send("You did not meet all the paramaters for " + name + ". Use $help syntax [command] for formatting");
    }
  }
};

//Commands after this line
addCommand("help", "s", (message, params) => {
  if(exports.list().includes(params[0])){
    message.channel.send(params[0].toUpperCase() + ": " + HELP_DATA[params[0].toLowerCase()].desc);
  }else{
    message.channel.send("\"" + params[0] + "\" is not a command, type $list for all default commands.");
  }
});
addCommand("help syntax", "s", (message, params) => {
  if(exports.list().includes(params[0])){
    message.channel.send("SYNTAX OF " + params[0].toUpperCase() + ": " + CMD_DELIMITER + params[0].toLowerCase() + " [" + HELP_DATA[params[0].toLowerCase()].synt.join("] [") + "]");
  }else{
    message.channel.send("\"" + params[0] + "\" is not a command, type $list for all default commands.");
  }
});
addCommand("perms", "s", (message, params) => {
  message.channel.send("Yea this command don't work :/");
});
addCommand("ifeven", "ws", (message, params) => {
  if(/\d/ig.test(params[0])){
    params[0] = parseInt(params[0]);
    message.channel.send(params[0] + " " + (params[0]%2==0 ? "is" : "isn't") + " even!");
  }else message.reply("I can't fucking even. Just put a number in...");
});
addCommand("relay", "ws", (message, params) => {
  if(params[0].includes("#")) message.client.channels.get(params[0].substring(2, 20)).send(params[1]);
  else if(params[0].includes("@"));
});
//Mentions

function saveMents(serverID, ments){
  fs.writeFileSync("./interactivity/content/" + serverID + "/ment.json", JSON.stringify(ments));
}

function loadMents(serverID){
  if(fs.existsSync("./interactivity/content/"+serverID+"/ment.json", "UTF8")){
    return JSON.parse(fs.readFileSync("./interactivity/content/"+serverID+"/ment.json", "UTF8"));
  }else{
    if(!fs.existsSync("./interactivity/content/"+serverID, "UTF8")) fs.mkdir("./interactivity/content/" + serverID);
    fs.open("./interactivity/content/" + serverID + "/ment.json", 'a', (err, file) => {
      if(err) throw err;
      else console.log("Created new ments for server " + serverID);
    });
    saveMents(serverID, {});
    return {};
  }
}

addCommand("ment", "w", (message, params) => {
  //data goes in ./content/[serverid]/ment.json
  var ments = loadMents(message.guild.id);
  params[0] = params[0].toLowerCase();
  if(ments[params[0]] && ments[params[0]].length>0) message.channel.send(params[0].toUpperCase() + ": " + ments[params[0]].join(", "));
  else if(ments[params[0]]) message.channel.send(params[0] + " is empty. Add users with \"$ment add " + params[0] + " [user]\".")
  else message.channel.send(params[0] + " is not a mention. Type $ment list for a list of mentions.");
});
addCommand("ment add", "ws", (message, params) => {
  var ments = loadMents(message.guild.id);
  params[0]=params[0].toLowerCase();
  if(params[1]==' '){
    //Add category
    //Test for forbidden groups
    if(!ments[params[0]]){
      if(!["add", "remove", "list", "random"].some(val => {
        if(params[0] == val){
          message.channel.send("\"" + params[0] + "\" is a forbidden name. Please try another.");
          return true;
        }
        return false;
      })){
        ments[params[0]] = [];
        message.channel.send("\"" + params[0] + "\" created as a mention list.");
      }
    }else{
      //Already exists
      message.channel.send(params[0] + " is already a mention list. Type \"$ment list\" for a list of mentions.");
    }
  }else{
    //Parse user
    params[1]=params[1].match(/<@!?(\d{18})>/)[0];
    //Add user
    if(ments[params[0]]){
      //Test for if user exists
      if(!ments[params[0]].includes(params[1])){
        ments[params[0]].push(params[1]);
        message.channel.send(params[1] + " was added to " + params[0] + ".");
      }
      else{
        //User already in mention
        message.channel.send(params[1] + " is already in " + params[0] + ".");
      }
    }else{
      message.channel.send(params[0] + " is not a mention list. Type \"$ment list\" for a list of mentions.");
      //Mention does not exist
    }
  }
  saveMents(message.guild.id, ments);
});
addCommand("ment remove", "ws", (message, params) => {
  var ments = loadMents(message.guild.id);
  params[0]=params[0].toLowerCase();
  if(params[1]==' '){
    //Remove group
    if(ments[params[0]]){
      delete ments[params[0]];
      message.channel.send(params[0] + " was deleted from the mentions.");
    }
    else{
      //Group does not exist
      message.channel.send(params[0] + " does not exist. Type \"$ment list\" for a list of mentions.");
    }
  }else{
    //Remove user
    params[1]=params[1].match(/<@!?(\d{18})>/)[0];
    if(ments[params[0]]){
      //List exists
      if(ments[params[0]].includes(params[1])){
        //Remove
        ments[params[0]].splice(ments[params[0]].indexOf(params[1]), 1);
        message.channel.send(params[1] + " was removed from " + params[0]);
      }else{
        //Doesn't exist
        message.channel.send(params[1] + " does not exist in " + params[0] + ".");
      }
    }
  }
  saveMents(message.guild.id, ments);
});
addCommand("ment random", "s", (message, params) => {
  var ments = loadMents(message.guild.id);
  var choice = Object.keys(ments)[Math.floor(Math.random()*Object.keys(ments).length)];
  message.channel.send(choice.toUpperCase() + ": " + ments[choice].join(","));
});
addCommand("ment list", "s", (message, params) => {
  var ments = loadMents(message.guild.id);
  if(Object.keys(ments).length>0) message.channel.send("LIST: " + Object.keys(ments).join(", "));
  else message.channel.send("There are no mention lists. Add some with \"$ment add [name]\".");
});
addCommand("cointoss", "s", (message, params) => {
  message.channel.send("It's " + ((Math.floor(Math.random()*2)==0) ? "heads" : "tails") + ".");
});
