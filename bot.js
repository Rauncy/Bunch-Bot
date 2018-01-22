"use strict";
const Discord = require('discord.js');
const fs = require('fs');
//const rl = require('readline');
//const console = rl.createInterface({input: process.stdin, output: process.stdout});
const bot = new Discord.Client();
exports.bot = bot;
//Import custom libraries
const inter = require("./interactivity.js");
const {perms, globals} = inter;
const cmd = inter["commands"];

bot.on('ready', () => {
  console.log("Bot is now online!");
  bot.user.setPresence({
    status:"dnd",
    game:{
      name:"your requests",
      type:"LISTENING"
    }
  });
});

var itype = false;

var banlist = ["168444189212672001"];

bot.on('message', (message) => {
  if(banlist.includes(message.author.id)){
    message.author.createDM().then(channel => {
      channel.send(channel.recipient + ", you are on the global-ban list. You cannot use this bot in any server. Appeal to <@185192156489580544>");
    });
    message.delete().then().catch(err => {message.channel.send(message.author + " is global-banned from commands. " + message.guild.owner + ", please allow me permission to delete their messages.")});
    return;
  }
  let t = message.content;
  let isDev = !message.author.bot && message.client.guilds.has("383814037257060362") && bot.guilds.get("383814037257060362").roles.get("383814579245023262").members.has(message.author.id);
  //N word
  var nWordRegex = /\b(n[il]+)[bg🅱️]+[era]*(s*)\b/gi;
  var bestGirlRegex = /(who'?s |who (is|be)? ?)best girl/ig;
  var benSwoloRegex = /ben swo+lo+/ig;
  var deWayRegex = /^do [you]+ k?no+w? d[ea] w[ea][ey]/ig;
  var spitRegex = /k?nu[ck]{2}les?.*?(ba+d|ter+ible+|overused|shi+t)/ig;
  var sierraRegex = /ho+t{2,}er.+?sier{2,}a+/ig;
  var weatherboyRegex = /wh?ere'?s? +<@!?\d{18}>/ig;
  if(!message.author.bot && nWordRegex.test(t) && !(t.match(/(ni+g+er+)/) && t.match(nWordRegex).length-1==(t.match(/(ni+g+er+)/).length-1)/2)){
    message.reply(`You mean "${t.replace(nWordRegex, "$1gger$2")}"?`);
  }
  if(!message.author.bot && bestGirlRegex.test(t)) message.channel.send("I'm not into girls. I prefer Crash Bandicoot for best boi.");
  if(!message.author.bot && benSwoloRegex.test(t)) message.channel.send("I really don't want to do this right now...", {files : ["http://i0.kym-cdn.com/entries/icons/original/000/025/003/benswoll.jpg"]});
  if(!message.author.bot && deWayRegex.test(t)) message.channel.send(message.author + " does not no de way. Dey do not hav de ebola.");
  if(!message.author.bot && spitRegex.test(t)) message.channel.send("Spit on de non beleeva!");
  if(!message.author.bot && sierraRegex.test(t)) message.channel.send("Nobody is hotter than me! My Coltonoli will agree with that.");
  if(!message.author.bot && weatherboyRegex.test(t)) message.channel.send("Wouldn't you like to know, Weather-boy.");
  //if(!message.author.bot && t.includes("<:Binking:403597251760357396>")) message.channel.send("Did you mean:", {files: ["http://i0.kym-cdn.com/photos/images/original/001/256/183/9d5.png"]});
  //Print DMs
  if(message.channel.type == "dm") console.log(message.author.username + ": " + t);
  if(message.author.id == "170219703363567616" && /<@!?317864998728761344>/ig.test(t)) message.channel.send("Yes Coltonoli?");
  //Process commands
  if(t.startsWith(cmd.DELIMITER)){
    //Test command
    let all = cmd.list();
    let cor = "";
    all.forEach(val => {
      if(t.substring(cmd.DELIMITER.length).startsWith(val) && val.length>cor.length) cor = val;
    });
    console.log("Command: " + cor);
    if(cor.length>0){
      if(message.channel.type == "text"){
        if(!perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
        if(perms.hasPermission(message.author.id, cmd.DELIMITER + cor, message.guild) || isDev) cmd.runCommand(cor, message);
        else message.channel.send("You do not have access to this command " + message.author);
      }else cmd.runCommand(cor, message);
    }else{
      message.channel.send("\"" + t.substring(cmd.DELIMITER.length,(t.indexOf(" ")!=-1 ? t.indexOf(" ") : t.length)) + "\" is not a command. Type \"" + cmd.DELIMITER + "help\" for all default commands.");
    }
  }
});

bot.on('messageReactionAdd', (react, user) => {
  if(react.emoji.id === "372163239037108224"){
    react.message.react(react.emoji);
  }
});

bot.login(JSON.parse(fs.readFileSync("./info.json")).token);
