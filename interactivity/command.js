"use strict";

const fs = require('fs');

//Custom Libraries
const {globals, perms} = require("../interactivity.js");
const {bot} = require('../bot.js');

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
function separateParams(cmd, text){
  if(text.startsWith(CMD_DELIMITER + cmd)){
    //Process params
    text = text.substring(cmd.length+CMD_DELIMITER.length+1);
    let list = commands[cmd].param;
    let params = [];
    while(list.length>0 && list.charAt(0).toLowerCase()!="s" && text.length>0){
      switch(list.charAt(0).toLowerCase()){
        case "c":
          params.push(text.charAt(0));
          break;
        case "w":
          if(text.includes(" ")) params.push(text.substring(0, text.indexOf(" ")));
          else params.push(text);
          break;
        case "*":
          list = list.substring(1);
          continue;
        default:
          break;
      }
      if(text.includes(" ")) text = text.substring(text.indexOf(" ")+1);
      else text="";
      list = list.substring(1);
    }
    if(list.charAt(0)=='s'){
      if(text.length>0) params.push(text);
    }
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
  if(params[0].includes("#")) message.client.channels.get(params[0].substring(2, 20)).send(params[1]);
  else if(params[0].includes("@")) message.client.get();
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
        case "here":
        //TODO
          //Only people in chat
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
    else message.channel.send(params[0].toUpperCase() + ": <@" + list.join(">, <@") + ">");
  }
  else if(ments[params[0]]) message.channel.send(params[0] + " is empty. Add users with \""+CMD_DELIMITER+"ment add " + params[0] + " [user]\".")
  else message.channel.send(params[0] + " is not a mention. Type "+CMD_DELIMITER+"ment list for a list of mentions.");
});
//TODO SWITCH FORMAT OF PARAMATERS
addCommand("ment add", "w*s", (message, params) => {
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
addCommand("ment remove", "w*s", (message, params) => {
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
//TODO FIX
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
  if(message.member.voiceChannel){
    var ments = loadMents(message.guild.id);
    var active = message.member.voiceChannel.members;
    var best, grade, bestGrade = Number.MIN_SAFE_INTEGER;
    Object.keys(ments).forEach((n) => {
      var i = ments[n];
      grade = 0;
      console.log(i);
      active.forEach((j) => {
        if(i.includes(j.id)) grade+=5;
        else grade--;
      });
      if(grade>bestGrade){
        best = n;
        bestGrade = grade;
      }
    });
    message.channel.send("Best fitting \""+best+"\": <@" + ments[best].join("> <@") + ">");
  }else{
    message.channel.send({embed:{
      description:"You must be in a voice channel to use bestfit!",
      title:"Mention Error",
      color:10818837
    }});
  }
});
//TODO RICH EMBED NEEDS TO BE ADDDED
addCommand("ment list", "", (message, params) => {
  var ments = loadMents(message.guild.id);
  if(Object.keys(ments).length>0) message.channel.send("LIST: " + Object.keys(ments).join(", "));
  else message.channel.send("There are no mention lists. Add some with \""+CMD_DELIMITER+"ment add [name]\".");
});

//Perms
addCommand("perms", "", (message, params) => {
  message.channel.send("Perms... there ya go", {files : ["https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-img.instyle.com%2Fsites%2Fdefault%2Ffiles%2Fimages%2F2017%2F03%2F031617-perm-embed-add-1.jpg"]});
});
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
addCommand("perms level", "ww", (message, params) => {
  message.channel.send("Yea this don't work yet :/");
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

addCommand("cointoss", "", (message, params) => {
  message.channel.send("It's " + ((Math.floor(Math.random()*2)==0) ? "heads" : "tails") + ".");
});
addCommand("talktome", "", (message, params) => {
  message.channel.send("Talk to the tome " + message.author,{files:["https://vignette.wikia.nocookie.net/darksouls/images/9/90/Braille_Divine_Tome_of_Carim.png"]});
});
addCommand("dm", "ws", (message, params) => {
  let uid = params[0].match(/\d{18}/)[0];
  if(uid && message.guild.members.has(uid)) message.guild.members.get(uid).createDM().then(c => {
    c.send(params[1]);
  });
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
addCommand("todo", "", (message, params) => {
  if(fs.existsSync("./todo.txt", "UTF-8")){
    fs.readFile("./todo.txt", "UTF-8", (err, data) => {
      message.channel.send("TODO:\n" + data);
    });
  }else{
    message.channel.send("TODO file not found. Ask <@185192156489580544> for info on this situation.");
  }
});
//Poll Name, Message, Options
addCommand("poll", "", (message, params) => {
  message.channel.send("WIP");
});
addCommand("recommend", "s", (message, params) => {
  params[0] = params[0].trim();
  if(fs.existsSync("./todo.txt")){
    var items = fs.readFileSync("./todo.txt", "UTF-8").split("\n");
    for(var i=0;i<items.length;i++){
      items[i] = items[i].charAt(0).toUpperCase() + items[i].substring(1).toLowerCase();
    }
    if(items.includes(params[0].toLowerCase())){
      messae.channel.send("This item is already in the list.\nPlease submit again with an original idea.\nHowever; there are no original ideas...");
    }else{
      items.push(params[0].charAt(0).toUpperCase() + params[0].substring(1).toLowerCase());
      fs.writeFile("./todo.txt", items.join("\n"), err => {
        if(err){
          message.channel.send("Ok it didn't work but idk wtf happened.");
        }else{
          message.channel.send("Your suggestion was added to the end of the list!");
        }
      });
    }
  }else{
    message.channel.send("The TODO file does not exist. Please contact the host of the bot <@185192156489580544>.");
  }
});
addCommand("arg", "", (message, params) => {
  message.channel.send("If you want, take a crack: 1110001000100010001000100010001000100000000000100000110000100010001000010011000");
});
addCommand("anthem", "*w", (message, params) => {
  if(params[0]){
    switch(params[0].toLowerCase()){
      case "english":
      case "espanol":
      case "español":
      case "deutch":
      case "nederland":
      case "francais":
      case "german":
      case "french":
      case "dutch":
      case "spanish":
        message.channel.send({embed:{
          title : "All hail red bretheren! Romanized Version",
          fields : [
            {
              name : "Verse 1",
              value : "Soiuz nerushimyj respublik svobodnykh, Splotila naveki Velikaia Rus. Da zdravstvuet sozdannyj volej narodov, Edinyj, moguchij Sovetskij Soiuz!"
            },
            {
              name : "Verse 2",
              value : "Slavsia, Otechestvo nashe svobodnoe, Druzhby narodov nadiozhnyj oplot! Partiia Lenina - sila narodnaia, Nas k torzhestvu kommunizma vediot!"
            },
            {
              name : "Verse 3",
              value : "Skvoz grozy siialo nam solntse svobody, I Lenin velikij nam put ozaril, Na pravoe delo on podnial narody, Na trud i na podvigi nas vdokhnovil."
            },
            {
              name : "Verse 4",
              value : "Slavsia, Otechestvo nashe svobodnoe, Druzhby narodov nadiozhnyj oplot! Partiia Lenina - sila narodnaia, Nas k torzhestvu kommunizma vediot!"
            },
            {
              name : "Verse 5",
              value : "V pobede bessmertnykh idej kommunizma, My vidim griadushchee nashej strany, I Krasnomu znameni slavnoj Otchizny, My budem vsegda bezzavetno verny!"
            },
            {
              name : "Verse 6",
              value : "Slavsia, Otechestvo nashe svobodnoe, Druzhby narodov nadiozhnyj oplot! Partiia Lenina - sila narodnaia, Nas k torzhestvu kommunizma vediot!"
            }
          ],
          color : 16711680
        }});
        break;
    }
  }else
  message.channel.send({embed:{
    title : "All hail red bretheren!",
    fields : [
      {
        name : "Verse 1",
        value : "Союз нерушимый республик свободных,Сплотила навеки Великая Русь. Да здравствует созданный волей народов, Единый, могучий Советский Союз!"
      },
      {
        name : "Verse 2",
        value : "Славься, Отечество наше свободное, Дружбы народов надёжный оплот! Партия Ленина - сила народная, Нас к торжеству коммунизма ведёт!"
      },
      {
        name : "Verse 3",
        value : "Сквозь грозы сияло нам солнце свободы, И Ленин великий нам путь озарил, На правое дело он поднял народы, На труд и на подвиги нас вдохновил."
      },
      {
        name : "Verse 4",
        value : "Славься, Отечество наше свободное, Дружбы народов надёжный оплот! Партия Ленина - сила народная, Нас к торжеству коммунизма ведёт!"
      },
      {
        name : "Verse 5",
        value : "В победе бессмертных идей коммунизма, Мы видим грядущее нашей страны, И Красному знамени славной Отчизны, Мы будем всегда беззаветно верны!"
      },
      {
        name : "Verse 6",
        value : "Славься, Отечество наше свободное, Дружбы народов надёжный оплот! Партия Ленина - сила народная, Нас к торжеству коммунизма ведёт!"
      }
    ],
    color : 16711680
  }});
});
addCommand("silence", "w", (message, params) => {
  if(/<@!?\d{18}>/.test(params[0])){

  }else{

  }
});
addCommand("clear", "", (message, params) => {
  var m = message.channel.messages;
  m.forEach(val => {
    if(val.author.id === bot.id) val.delete();
  });
});
