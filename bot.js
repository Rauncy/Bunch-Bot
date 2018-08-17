//START NEW CODE

"use strict";
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const ict = require('./interactivity.js');
const {perms, globals} = ict;
const cmd = inter.commands;

bot.on('ready', () => {
  console.log("--<Bunch Bot V2(Alpha)>--");
  bot.user.setPresence({
    status:"online",
    game:{
      name:"your requests",
      type:"LISTENING"
    }
  });
});

//TODO
bot.on('message', m => {
  let cont = message.content;
  let isDev = !message.author.bot && message.client.guilds.has("383814037257060362") && bot.guilds.get("383814037257060362").roles.get("383814579245023262").members.has(message.author.id);

  //PROCESS FILTERS
  if(ict.hasListener(message.guild.id, message.author.id)){

  }
  //PROCESS COMMANDS
  //PROCESS CUSTOM RESPONSES
});

let fileJSON = JSON.parse(fs.readFileSync("./info.json"));
globals.version = fileJSON.version;
bot.login(fileJSON.token);

//START OLD CODE

// "use strict";
// const Discord = require('discord.js');
// const fs = require('fs');
// //const rl = require('readline');
// //const console = rl.createInterface({input: process.stdin, output: process.stdout});
// const bot = new Discord.Client();
// exports.bot = bot;
// //Import custom libraries
// const inter = require("./interactivity.js");
// const {perms, globals} = inter;
// const cmd = inter.commands;
//
// bot.on('ready', () => {
//   console.log("Bot is now online!");
//   bot.user.setPresence({
//     status:"idle",
//     game:{
//       name:"your requests",
//       type:"LISTENING"
//     }
//   });
// });
//
// var thots = ["385288650172399617", "184030502070517761", "271781374162108426"];
// bot.on('voiceStateUpdate', (oMem, nMem) => {
//   if(thots.includes(nMem.id) && nMem.voiceChannel){
//     var cVoz = nMem.voiceChannel;
//     cVoz.join().then(conn => {
//       const broadcast = bot.createVoiceBroadcast();
//       broadcast.playFile("./interactivity/temp/musicCache/NO THOTS.wav");
//       conn.playBroadcast(broadcast);
//       setTimeout(() => {
//         var chan = nMem.guild.member(bot.user.id).voiceChannel;
//         if(chan){
//           chan.leave();
//         }
//       }, 2500);
//     }).catch(err => {
//       console.error(err);
//     });
//   }
// });
//
// var specialListeners = {};
// bot.on('message', (message) => {
//   let t = message.content;
//   let isDev = !message.author.bot && message.client.guilds.has("383814037257060362") && bot.guilds.get("383814037257060362").roles.get("383814579245023262").members.has(message.author.id);
//   let normalNameMention = true;
//
//   //N word
//   var nWordRegex = /\b(n[il]+)[bg🅱️]+[era]*(s*)\b/gi;
//   var bestGirlRegex = /(who'?s |who (is|be)? ?)best girl/ig;
//   var benSwoloRegex = /ben swo+lo+/ig;
//   var sierraRegex = /ho+t{2,}er.+?sier{2,}a+/ig;
//   var weatherboyRegex = /wh?ere'?s? +<@!?\d{18}>/ig;
//   var broadwayRegex = /<@!?317864998728761344> +how +a?re? +y?o?u +w[i/]t?h? +math\??/ig;
//   var godsRegex = /<@!?317864998728761344> +do +y?o?u +l[ou]ve? +me+\?*/;
//   if(!message.author.bot && nWordRegex.test(t) && !(t.match(/(ni+g+er+)/) && t.match(nWordRegex).length-1==(t.match(/(ni+g+er+)/).length-1)/2)){
//     message.reply(`You mean "${t.replace(nWordRegex, "$1gger$2")}"?`);
//   }
//   if(bestGirlRegex.test(t)) message.channel.send("I'm not into girls. I prefer Crash Bandicoot for best boi.");
//   if(benSwoloRegex.test(t)) message.channel.send("I really don't want to do this right now...", {files : ["http://i0.kym-cdn.com/entries/icons/original/000/025/003/benswoll.jpg"]});
//   if(sierraRegex.test(t)) message.channel.send("Nobody is hotter than me! My Coltonoli will agree with that.");
//   if(weatherboyRegex.test(t)) message.channel.send("Wouldn't you like to know, Weather-boy.");
//   if(broadwayRegex.test(t)){
//     message.channel.send("I'm a supercomputer "+(message.member.nickname?message.member.nickname:message.author.username)+", I'm made of math.");
//     normalNameMention = false;
//   }
//   if(godsRegex.test(t)){
//     message.channel.send("Only partly. I only love my bed and my momma, I'm sorry.");
//     normalNameMention = false;
//   }
//   //if(!message.author.bot && t.includes("<:Binking:403597251760357396>")) message.channel.send("Did you mean:", {files: ["http://i0.kym-cdn.com/photos/images/original/001/256/183/9d5.png"]});
//   //Print DMs
//   if(message.channel.type == "dm") console.log(message.author.username + ": " + t);
//   if(normalNameMention && /<@!?317864998728761344>/ig.test(t)){
//     if(message.author.id == "170219703363567616") message.channel.send("Yes Coltonoli?");
//     else message.channel.send("Mm-hmm?");
//   }
//
//   //Process commands
//   if(t.startsWith(cmd.DELIMITER)){
//     //Test command
//     let all = cmd.list();
//     let cor = "";
//     all.forEach(val => {
//       if(t.substring(cmd.DELIMITER.length).startsWith(val) && val.length>cor.length) cor = val;
//     });
//     console.log("Command: " + cor);
//     if(cor.length>0){
//       try{
//         if(message.channel.type == "text"){
//           if(!perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
//           if(perms.hasPermission(message.author.id, cmd.DELIMITER + cor, message.guild) || isDev) cmd.runCommand(cor, message);
//           else message.channel.send("You do not have access to this command " + message.author);
//         }else{
//           cmd.runCommand(cor, message);
//         }
//       }catch(err){
//         message.guild.members.get("185192156489580544").createDM().then(c => {
//           c.send("An error occured while executing \""+cor+"\" with the content \""+message.content+"\"");
//         });
//         message.channel.send("An error occured while executing "+cmd.DELIMITER+cor+". An error report was submitted.");
//         console.error(err);
//       }
//
//     }else{
//       message.channel.send("\"" + t.substring(cmd.DELIMITER.length,(t.indexOf(" ")!=-1 ? t.indexOf(" ") : t.length)) + "\" is not a command. Type \"" + cmd.DELIMITER + "help\" for all default commands.");
//     }
//   }
// });
//
// bot.on('messageReactionAdd', (react, user) => {
//   if(react.emoji.id === "372163239037108224"){
//     react.message.react(react.emoji);
//   }
// });
//
// bot.login(JSON.parse(fs.readFileSync("./info.json")).token);
