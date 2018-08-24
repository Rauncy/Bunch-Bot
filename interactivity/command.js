"use strict";

const fs = require('fs');
const Discord = require('discord.js');

//Custom Libraries
const intr = require("../interactivity.js");
const {bot} = require('../bot.js');
var perms, globals;

setTimeout(()=>{
  perms = intr.perms;
  globals = intr.globals;
},100);

const CMD_DELIMITER = "$";
const HELP_DATA = {
  help : {
    desc : "Tells you how to use commands. If you are seeing this you know how to use this command.",
    synt : ["Command Name"]
  },
  "help syntax" : {
    desc: "Tells you what to put and where to put it.",
    synt : ["Command Name"]
  },
  ifeven : {
    desc : "Tests if a number is even or not because I can't use CJ's bot :(",
    synt : ["Number"]
  },
  perms : {
    desc : "Allows modification of permissions within the bot. Subcommands: \"allow\", \"revoke\", \"remove\", \"level\", \"test\", and \"raw\"",
    synt : ["Subcommand", "User/Role", "Command/Feature"]
  },
  cointoss : {
    desc : "Flips a coin.",
    synt : []
  },
  ment : {
    desc : "Allows mention lists to be added, removed, and modified. Subcommands: \"add\", \"remove\", \"random\", and \"list\".",
    synt : ["Subcommand/Group", "List", "User"]
  },
  talktome : {
    desc : "Just a nice little meme that will be turned into a custom command later.",
    synt : []
  },
  dm : {
    desc : "Direct messages a person. FOR TESTING PURPOSES ONLY! NOT FOR FULL IMPLEMENTATION!",
    synt : ["User", "Message"]
  },
  random : {
    desc : "Created a random number from the given range.",
    synt : ["LowerRange-UpperRange", "Count"]
  },
  todo : {
    desc : "Prints a todo list for the developers of me. You can see this too. It is updated as frequently as possible.",
    synt : []
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
*: End of required params
*/
//TODO S NEEDS TO BE SATISFIED BEFORE CONTINUING WITH BACK
function separateParams(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){
    //Process params
    text = text.substring(cmd.length+CMD_DELIMITER.length+1);
    let list = commands[cmd].param;
    let params = [];

    let tBack = 0;
    let tp;
    while(text.length>0&&list.length>0){
      console.log("run: "+params);
      switch(list.charAt(0).toLowerCase()){
        case "c":
          console.log("c");
          params.push(text.charAt(0));
          break;
        case "w":
          console.log("w");
          if(text.includes(" ")){
            console.log("spa");
            params.push(text.substring(0, text.indexOf(" ")));
          }
          else{
            params.push(text);
            text = "";
          }
          break;
        case "*":
          console.log("*");
          list = list.substring(1);
          continue;
        case "s":
          if(!tp){
            console.log("s1");
            list = list.split("").reverse().join("");
            console.log("nl: "+list);
            text = text.split("").reverse().join("");
            console.log("nt: "+text);
            tp = params;
            params = [];
            continue;
          }else{
            console.log("s2");
            tp.push(text.split("").reverse().join(""));
          }
          break;
        default:
          list = list.substring(1);
          break;
      }
      if(text.includes(" ")){
        console.log("isp");
        text = text.substring(text.indexOf(" ")+1);
        console.log("t: "+text);
      }
      list = list.substring(1);
      console.log("nl: "+list);
    }
    //TODO CLEANUP
    if(tp){
      for(var i=0; i<params.length; i++){
        params[i] = params[i].split("").reverse().join("");
      }
      params = tp.concat(params.reverse());
    }
    console.log(cmd + ": " + params);
    return params;
  }else return undefined;
};

exports.list = function(){
  return Object.keys(commands);
};

exports.runCommand = function(name, message){
  console.log("C: " + name + " M: " + message.content);
  var pars = separateParams(name, message.content);
  if(commands[name]){
    if(pars.length>=(commands[name].param.includes("*") ? commands[name].param.indexOf("*") : commands[name].param.length)){
      commands[name].run(message, separateParams(name, message.content));
    }else{
      message.channel.send("You did not meet all the paramaters for " + name + ". Use *"+CMD_DELIMITER+"help syntax "+name+"* for formatting");
    }
  }
};

//Commands after this line
addCommand("help", "*s", (message, params) => {
  if(!params[0]) message.channel.send({embed:{
    title:"Default commands",
    description:CMD_DELIMITER + Object.keys(commands).join(", "+CMD_DELIMITER),
    color:15575319
  }});
  else if(exports.list().includes(params[0])){
    var best = "";
    Object.keys(HELP_DATA).forEach(val => {
      if(params[0].startsWith(val) && val.length>best.length) best=val;
    });
    if(best.length>0){
      //TODO splice already given paramaters
      message.channel.send({embed:{
        title:"Help for " + params[0].toLowerCase(),
        description:HELP_DATA[params[0].toLowerCase()].desc,
        color:15575319
      }});
    }else{
      message.channel.send({embed:{
        title:"Help Error",
        description:CMD_DELIMITER + params[0].charAt(0).toUpperCase() + params[0].substring(1).toLowerCase() + " is not a command, type "+CMD_DELIMITER+"help for all default commands.",
        color:10818837
      }});
    }
  }else{
    message.channel.send("\"" + params[0] + "\" is not a command, type "+CMD_DELIMITER+"help for all default commands.");
  }
});
addCommand("help syntax", "s", (message, params) => {
  if(Object.keys(HELP_DATA).includes(params[0])){
    message.channel.send({embed:{
      description:CMD_DELIMITER + params[0].toLowerCase() + " [" + HELP_DATA[params[0].toLowerCase()].synt.join("] [") + "]",
      title:"Syntax of " + params[0].toLowerCase(),
      color:15575319
    }});
  }else if(exports.list().includes(params[0])){
    var best = "";
    Object.keys(HELP_DATA).forEach(val => {
      if(params[0].startsWith(val) && val.length>best.length) best=val;
    });
    if(best.length===0) message.channel.send({embed:{
      title:"Help Error",
      description:CMD_DELIMITER + params[0].charAt(0).toUpperCase() + params[0].substring(1).toLowerCase() + " is not a command, type "+CMD_DELIMITER+"help for all default commands.",
      color:10818837
    }});
    else{
      var data = "";
      var list = HELP_DATA[best.toLowerCase()].synt;
      var notation = "[]";
      //TODO splice already given paramaters
      list.splice(0, params[0].split(" ").length - best.split(" ").length);
      for(var i = 0;i<list.length;i++){
        if(i<commands[params[0]].param.length && commands[params[0]].param.charAt(i)==="*"){
          notation = "()"
        }
        data += " " + notation.charAt(0) + list[i] + notation.charAt(1);
      }
      message.channel.send({embed:{
        fields:[{
          "name" : "Syntax: [argument] is a required argument. (argument) is an optional argument",
          "value" : CMD_DELIMITER + params[0].toLowerCase() + data
      }],
        title:"Syntax of " + params[0].toLowerCase(),
        color:15575319
      }});
    }
  }else{
    message.channel.send({embed:{
      title:"Help Error",
      desctiption:CMD_DELIMITER + params[0].charAt(0).toUpperCase() + params[0].substring(1).toLowerCase() + " is not a command, type "+CMD_DELIMITER+"help for all default commands.",
      color:10818837
    }});
  }
});
addCommand("ifeven", "w*s", (message, params) => {
  if(/\d/ig.test(params[0])){
    params[0] = parseInt(params[0]);
    message.channel.send(params[0] + " " + (params[0]%2==0 ? "is" : "isn't") + " even!");
  }else message.reply("I can't fucking even. Just put a number in...");
});
addCommand("relay", "ws", (message, params) => {
  if(/<#\d{18}>/.test(params[0])) message.client.channels.get(params[0].match(/<#(\d{18})>/))[1].send(params[1]);
  else if(/<@!?\d{18}>/.test(params[0])){
    let uid = params[0].match(/<@!?(\d{18})>/)[1];
    if(uid){
      bot.fetchUser(uid).then(user=>{
        user.createDM().then(c => {
          c.send(params[1]);
        });
      }).catch(e=>{
        message.channel.send("This user does not exist.");
      });
    }
  }
});
//Mentions

function saveMents(serverID, ments){
  fs.writeFileSync("./interactivity/content/" + serverID + "/ment.json", JSON.stringify(ments));
}

function loadMents(serverID){
  if(fs.existsSync("./interactivity/content/"+serverID+"/ment.json", "UTF8")){
    return JSON.parse(fs.readFileSync("./interactivity/content/"+serverID+"/ment.json", "UTF8"));
  }else{
    if(!fs.existsSync("./interactivity/content/"+serverID, "UTF8")) fs.mkdirSync("./interactivity/content/" + serverID);
    fs.open("./interactivity/content/" + serverID + "/ment.json", 'a', (err, file) => {
      if(err) throw err;
      else{
        saveMents(serverID, {});
        console.log("Created new ments for server " + serverID);
      }
    });
    return {};
  }
}

function isID(s){return s.test(/<@!?\d{18}>/)}

addCommand("ment", "w*w", (message, params) => {
  //data goes in ./content/[serverid]/ment.json
  var ments = loadMents(message.guild.id);
  params[0] = params[0].toLowerCase();
  if(ments[params[0]] && ments[params[0]].length>0){
    var list = ments[params[0]];
    if(list.includes(message.author.id)) list.splice(list.indexOf(message.author.id), 1);
    if(params[1]){
      var templist = [];
      switch(params[1].toLowerCase()){
        case "online":
          //Only people online
          list.forEach(val => {
            if(bot.users.has(val) && bot.users.get(val).presence.status != "offline") templist.push(val);
          });
          break;
        case "offline":
          //Only people offline
          list.forEach(val => {
            if(bot.users.has(val) && bot.users.get(val).presence.status == "offline") templist.push(val);
          });
          break;
        default:
          message.channel.send(params[1] + " is not a valid identifier for mentions.\nValid identifiers: \"online\", and \"offline\"");
          //Makes so the nobody from message doesn't display
          templist = list;
          break;
      }
      if(templist.length===0){
        message.channel.send("Nobody from the " + params[0].toLowerCase() + " group is " + params[1].toLowerCase() + ".\nPlease try a different descriptor or none at all.\nMentioning all of " + params[0].toLowerCase());
      }else list = templist;
    }
    if(templist && templist.length===0) message.channel.send("Only you are in this mention group. Please add more people for the mention group to work properly.");
    else{
      message.channel.send({embed:{
        fields:[
          {
            name:"By " + (message.member.nickname!=null?message.member.nickname:message.author.username),
            value:"<@" + list.join(">, <@") + ">"
          }
        ],
        title:"Mention group "+params[0].toUpperCase(),
        color:1857202
      }});
      // message.channel.send(params[0].toUpperCase() + " by " + (message.member.nickname!=null?message.member.nickname:message.author.username) + ": <@" + list.join(">, <@") + ">");
    }
  }
  else if(ments[params[0]]) message.channel.send(params[0] + " is empty. Add users with \""+CMD_DELIMITER+"ment add " + params[0] + " [user]\".")
  else message.channel.send(params[0] + " is not a mention. Type "+CMD_DELIMITER+"ment list for a list of mentions.");
});
//TODO SWITCH FORMAT OF PARAMATERS
addCommand("ment add", "w*w", (message, params) => {
  var ments = loadMents(message.guild.id);
  params[0]=params[0].toLowerCase();
  if(!params[1]){
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
      message.channel.send(params[0] + " is already a mention list. Type \""+CMD_DELIMITER+"ment list\" for a list of mentions.");
    }
  }else if(/<@!?\d{18}>/.test(params[1])){
    //Parse user
    params[1]=params[1].match(/<@!?(\d{18})>/)[1];
    //Add user
    if(ments[params[0]]){
      //Test for if user exists
      if(!ments[params[0]].includes(params[1])){
        ments[params[0]].push(params[1]);
        message.channel.send("<@" + params[1] + "> was added to " + params[0] + ".");
      }
      else{
        //User already in mention
        message.channel.send("<@" + params[1] + "> is already in " + params[0] + ".");
      }
    }else{
      message.channel.send(params[0] + " is not a mention list. Type \""+CMD_DELIMITER+"ment list\" for a list of mentions.");
      //Mention does not exist
    }
  }else{
    message.channel.send({embed:{
      description:params[1] + " is not a valid user. Please mention the person you want to add when trying again.",
      title:"Mention Error",
      color:10818837
    }});
  }
  saveMents(message.guild.id, ments);
});
//TODO SWITCH FORMAT OF PARAMATERS
addCommand("ment remove", "w*w", (message, params) => {
  var ments = loadMents(message.guild.id);
  params[0]=params[0].toLowerCase();
  if(!params[1]){
    //Remove group
    if(ments[params[0]]){
      delete ments[params[0]];
      message.channel.send(params[0] + " was removed from the mentions.");
    }
    else{
      //Group does not exist
      message.channel.send(params[0] + " does not exist. Type \""+CMD_DELIMITER+"ment list\" for a list of mentions.");
    }
  }else if(/<@!?\d{18}>/.test(params[1])){
    //Remove user
    params[1]=params[1].match(/<@!?(\d{18})>/)[1];
    if(ments[params[0]]){
      //List exists
      if(ments[params[0]].includes(params[1])){
        //Remove
        ments[params[0]].splice(ments[params[0]].indexOf(params[1]), 1);
        message.channel.send("<@" + params[1] + "> was removed from " + params[0] + ".");
      }else{
        //Doesn't exist
        message.channel.send("<@" + params[1] + "> does not exist in " + params[0] + ".");
      }
    }
  }else{
    message.channel.send({embed:{
      description:params[1] + " is not a valid user. Please mention the person you want to remove when trying again.",
      title:"Mention Error",
      color:10818837
    }});
  }
  saveMents(message.guild.id, ments);
});

addCommand("ment random", "", (message, params) => {
  var ments = loadMents(message.guild.id);
  if(ments != {}){
    var choice = Math.floor(Math.random()*Object.keys(ments).length);
    var list = Object.values(ments)[choice];
    message.channel.send("Random ment \""+Object.keys(ments)[choice]+"\": <@"+ list.join(">, <@") + ">");
  }else{
    message.channel.send({embed:{
      description:"There are no mentions. Add some using "+CMD_DELIMITER+"ment add [name].",
      title:"Mention Error",
      color:10818837
    }});
  }

});
addCommand("ment bestfit", "", (message, params) => {
  var ments = loadMents(message.guild.id);
  var preactive = message.guild.members.array();
  var active = [];
  preactive.forEach(val => {
    if(val.presence.status == "online") active.push(val.id);
  });
  console.log("a: " + active);
  var best, grade, bestGrade = Number.MIN_SAFE_INTEGER;
  Object.keys(ments).forEach((n) => {
    var i = ments[n];
    grade = -i.length;
    console.log(i);
    active.forEach((j) => {
      if(i.includes(j.id)) grade+=5;
      else grade--;
    });
    console.log(grade);
    console.log("\n");
    if(grade>bestGrade){
      best = n;
      bestGrade = grade;
    }
  });
  message.channel.send("Best fitting ment: \""+best+"\"");
});
//TODO RICH EMBED NEEDS TO BE ADDDED
addCommand("ment list", "*w", (message, params) => {
  //TODO CHANGE THE COMMAND SO YOU CAN MENT LIST W AND THEN ITS THAT MENT LISTED AND NOT MENTIONED
  var ments = loadMents(message.guild.id);
  if(Object.keys(ments).length>0) message.channel.send("LIST: " + Object.keys(ments).join(", "));
  else message.channel.send("There are no mention lists. Add some with \""+CMD_DELIMITER+"ment add [name]\".");
});

//Perms
addCommand("perms allow", "ws", (message, params) => {
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  if(perms.allow(params[0], perms.definePermission(message.guild, params[1]))){
    message.channel.send("Allowed " + params[0] + " into " + params[1] + ".");
  }else message.channel.send("Failed to allow " + params[0] + " into " + params[1] + ".");
  perms.savePerms(message.guild);
});
addCommand("perms revoke", "ws", (message, params) => {
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  if(perms.disallow(params[0], perms.definePermission(message.guild, params[1]))){
    message.channel.send("Revoked " + params[0] + " from " + params[1] + ".");
  }else message.channel.send("Failed to revoke " + params[0] + " from " + params[1] + ". I dunno why, but it happened.");
  perms.savePerms(message.guild);
});
addCommand("perms remove", "ws", (message, params) => {
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  if(perms.remove(params[0], perms.definePermission(message.guild, params[1]))){
    message.channel.send("Removed " + params[0] + " from " + params[1] + " successfully.");
  }else message.channel.send("Failed to remove " + params[0] + " from " + params[1] + ".");
  perms.savePerms(message.guild);
});
addCommand("perms level set", "sw", (message, params) => {
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  let al = perms.getLevel(message.guild, message.author.id);
  if(/^<@!?(\d{18})>$/.test(params[0])){
    params[0] = params[0].replace(/<@!?(\d{18})>/, "$1");
  }
  let tl = perms.getLevel(message.guild, params[0]);

  if(tl<al&&params[1]<al){
    perms.setLevel(message.guild, params[1]);
    message.channel.send("Permission successfully changed on " + params[0] + " to "+params[1]);
  }else{
    if(tl>=al) message.channel.send("Permission unsuccessfully changed. Your target has an equal or higher level than you do.");
    else message.channel.send("Permission unsuccessfully changed. Your requested level must be less than your level.");
  }
});
addCommand("perms level get", "w", (message, params) => {
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  let l = perms.getLevel(message.guild, params[0]);
  if(l){
    message.channel.send("The level of "+params[0]+" is "+l);
  }else{
    message.channel.send("This person/command has no level.")
  }

});
addCommand("perms raw", "", (message, params) => {
  console.log(perms.isLoaded(message.guild));
  if(message.channel.type == "text" && !perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
  let all = perms.all(message.guild);
  all.replace(/:([{\[])/ig, ":\n$1");
  all.replace(/[{\[]/ig, "$1\n");
  message.channel.send({embed:{
    color:3557316,
    description:all,
    title:"Raw permissions for " + message.guild.name
  }});
});

addCommand("coin", "", (message, params) => {
  message.channel.send("It's " + ((Math.floor(Math.random()*2)===0) ? "heads" : "tails") + ".");
});

addCommand("random", "w*w", (message, params) => {
  var low = params[0].split("-");
  var high = parseInt(low[1]);
  low = parseInt(low[0]);
  var i = (params[1] ? params[1] : 1);
  var out = "";
  while(--i>=0) out += " " + (Math.floor(Math.random()*(high-low+1)+low));
  message.channel.send("Random number from " + low + " to " + high + (params[1] ? " " + params[1] + " times" : "") + ":" + out);
});

var isSleeping = [];
addCommand("sleep", "", (message, params) => {
  if(message.channel.id != null){
    if(!isSleeping.includes(message.channel.id)){
      message.channel.send({files:["http://i0.kym-cdn.com/entries/icons/facebook/000/022/310/isleep.jpg"]});
      setTimeout(() => {
        isSleeping.push(message.channel.id);
      }, 1500);
    }else{
      message.channel.send({embed:{
        description:"Y'all niggas gotta sloop on the sleep",
        title:"Oversleep error",
        color:10818837
      }});
    }
  }
});

addCommand("about", "", (message, params)=>{
  message.channel.send("Bunch Bot is an interactive tool for Discord messenger that provides simple features for server managment, maintainance, and automation. Current version: v1 (Closed Private Alpha)");
});

bot.on("message", (message) => {
  //SLEEP COMMAND
  if(!message.author.bot && message.content != CMD_DELIMITER+"sleep" && isSleeping.includes(message.channel.id)){
    isSleeping.splice(isSleeping.indexOf(message.channel.id),1);
    message.channel.send({files:["https://i.ytimg.com/vi/YqAcdqXrOb0/maxresdefault.jpg"]});
  }

  //DUEL COMMAND
  if(message.channel.type == "dm" && Object.keys(currentPlayers).includes(message.author.id)){
    processDuel(message);
  }
});

bot.on("guildMemberSpeaking", (gm, speak) => {
  if(gm.guild.id == "182693821153411072" && gm.id == "185192156489580544" && speak){
    let all = gm.voiceChannel.members;
    // all.delete("182697162734436352");
    all = all.values();

    all.forEach(val => {
      val.createDM().then(chan => {
        chan.send("Please don't listen to anything CJ has to say, he is a registered sex offender.");
      });
    });
  }
});
