"use strict";
const Discord = require('discord.js');
const fs = require('fs');
//const rl = require('readline');
//const console = rl.createInterface({input: process.stdin, output: process.stdout});
const bot = new Discord.Client();

//Import custom libraries
const perms = require('./interactivity/perm.js');

bot.on('ready', () => {
  console.log("Bot is now online!");
  console.log(new Date())
});

var itype = false;

bot.on('message', (message) => {
  let t = message.content;
  if(message.client.guilds.has("383814037257060362") && bot.guilds.get("383814037257060362").roles.get("383814579245023262").members.has(message.member.id)){

  }
  var nWordRegex = /\b(n[il]+)[bg🅱️]+[era]*(s*)\b/gi;
  var dokiRegex = /([literau]{3,}\s?club|ori|suki|uri|nika|do+k+i+|<@&236665582869676033>)/gi;
  var thotRegex = /^be+ +go+ne+ +(.+?)ot$/gi;
  if(!message.author.bot && nWordRegex.test(t)) message.reply(`You mean "${t.replace(nWordRegex, "$1gger$2")}"?`);
  if(!message.author.bot && dokiRegex.test(t)){
    /*
    var contents = dokiRegex.exec(t);
    console.log(contents);
    for(var i=1;i<contents.length;i++){
      while(contents.includes(contents[i], contents.indexOf(contents[i]))){
        contents.splice(contents.indexOf(contents[i], contents.indexOf(contents[i])), 1);
      }
    }
    message.reply(`no ${contents.join(", or ")}. ${(contents.length>1 ? "They're" : "It's")} gay.`);
    */
    message.reply("doki doki gay af");
  }
  if(/[o0u]+[w]+[o0u]/gi.test(t) && !message.author.bot) message.channel.send("<@&375512928872300544>");
  if(t.includes("<@&375512928872300544>") && !message.author.bot) message.channel.send("Notices <@&375512928872300544>, OwO whats this?");
  //if(t.includes(/(i'm|i am) (.+)/ig))
  if(thotRegex.test(t)) message.reply(message.content.replace(thotRegex, "OUST THE $1OT").toUpperCase());
  if(/^\$ifEven (\d+)/ig.test(t)){
    message.channel.send("I can't even, let me try my sources");
    message.channel.send(".ifEven " + t.match(/^\$ifEven (\d+)/ig)[1]);
  }
  if(t.startsWith('$perms')){
    if(!perms.isLoaded(message.guild)) perms.loadPerms(message.guild);
    let cmds = t.split(" ");
    if(cmds[1]){
      switch(cmds[1]){
        case "allow":
          if(cmds[2]){
            //Has perm name
            if(cmds[3]){
              //Has perm content
              perms.allow(cmds[2], perms.definePermission(message.guild, cmds[3]));

            }else{
              message.channel.send(cmds[2] + " requires a permission to modify");
            }
          }else{
            message.channel.send("Allow requires a user to allow");
          }
          break;
        case "revoke":
          if(cmds[2]){
            //Has perm name
            if(cmds[3]){
              //Has perm content
              perms.disallow(cmds[2], perms.definePermission(message.guild, cmds[3]));

            }else{
              message.channel.send(cmds[2] + " requires a permission to modify");
            }
          }else{
            message.channel.send("Revoke requires a user to revoke");
          }
          break;
        case "remove":
          if(cmds[2]){
            //Has perm name
            if(cmds[3]){
              //Has perm content
              if(perms.remove(cmds[2], perms.definePermission(message.guild, cmds[3]))){
                message.channel.send("Removed successfully");
              }else{
                message.channel.send("Removed unsuccessfully");
              }

            }else{
              message.channel.send(cmds[2] + " requires a permission to remove");
            }
          }else{
            message.channel.send("Remove requires a user to remove");
          }
          break;
        case "level":
          if(cmds[2] && /<@!?\d{18}>/i.test(cmds[2])){
            if(cmds[3] && parseInt(cmds[3])==cmds[3]){
              perms.setLevel(message.guild, cmds[2].match(/\d{18}/)[0], parseInt(cmds[3]));
            }else if(cmds[3] && cmds[3] == "delete"){
              perms.removeLevel(message.guild, cmds[2].match(/\d{18}/)[0]);
            }else{
              message.channel.send(cmds[2] + " requires a level to set");
            }
          }else if(cmds[2]){
            if(cmds[3] && parseInt(cmds[3])==cmds[3]){
              perms.definePermission(message.guild, cmds[2]).level = cmds[3];
            }else{
              message.channel.send(cmds[2] + " requires a level to set");
            }
          }else{
            message.channel.send("Level requires a level to set");
          }
          break;
        case "save":
          perms.savePerms(message.channel.guild);
          break;
        case "all":
          message.channel.send(perms.all());
          break;
        case "test":
          if(cmds[2]){
            //Has test condition
            //How directories are being assigned

            if(cmds[3]){
              if(/\d{18}/.test(cmds[2])){
                if(perms.hasPermission(cmds[2], cmds[3], message.guild)){
                  message.channel.send(cmds[2] + " can use this command");
                }else{
                  message.channel.send(cmds[2] + " can't use this command");
                }
              }else{
                message.channel.send("User must be valid");
              }
            }else{
              message.channel.send("Must contain a permission to test");
            }
          }else{
            //No test condition
            message.channel.send("Must contain an indexable permission");
          }
          break;
        case "raw":
          if(cmds[2]) message.channel.send("RAW: " + perms.getRaw(perms.definePerm(message.guild, cmds[2])));
          else message.channel.send("RAW: " + perms.all(message.guild));
          break;
        default:
          message.channel.send("Available subcommands: allow, revoke, remove, level, save, test");
          break;
      }
    }else{
      message.channel.send("Available subcommands: allow, revoke, remove, level, save, test");
    }
  }
  /*
  let t = message.content.toLowerCase();
  console.log(t);
  if(t.includes("nigga") || t.includes("nibba") || t.includes("nibber")){
    message.channel.send('You mean \"' + t.replace("nigga", "nigger").replace("nibba", "nigger").replace("nibber", "nigger") + "\"?");
  }
  if(t.includes("nig nog") || t.includes("nig-nog") || t.includes("nignog")){
    message.channel.send('You mean \"' + t.replace("nig nog", "eggnog").replace("nig-nog", "eggnog").replace("nignog", "eggnog") + "\"?");
  }
  if(t == "why did colton make the discord?"){
    message.channel.send("Because Colton wanted to make it before William. Fuck you William.");
  }
  if(t.includes(":feelsgoodman:")){
    message.channel.send("Nah, <:feelsbadman:372163239037108224><:snowball:368518005493202945>");
  }
  if((t.includes("<@!184030502070517761>") || t.includes("<@184030502070517761>"))&&!message.author.bot){
    message.reply("Bill fucks with nobody!");
  }
  if((t.includes("<@!317864998728761344>") || t.includes("<@317864998728761344>"))&&!message.author.bot){
    message.reply("Ye?");
  }if((t.includes("eggs, bacon, grits"))&&!message.author.bot){
    message.channel.send("SAUSAGE!");
  }if(t.includes(" bot") || t.includes("bot ") || t.includes(" bot ")){
    message.reply("Fuck did you say about me?\nSquare up faggot.");
  }
  */
  //Commands
  //if(message.author.id === bot.id || !message.author.bot) processCommand(message);

});

bot.on('messageReactionAdd', (react, user) => {
  if(react.emoji.id === "372163239037108224"){
    react.message.react(react.emoji);
  }
});

function processCommand(message){
  var delimiter = "$";
  if(message.content.startsWith(delimiter)){
    var cmd = message.content.substring(delimiter.length).toLowerCase().split(" ");
    switch(cmd[0]){
      case "clear":
        message.channel.fetchMessages()
          .then( messages => {
            messages = Array.from(messages.values());
            console.log((this.bot ? "YE" : "NE"));
            messages.forEach(val => {
              if(val.author.id === bot.id) val.delete();
            });
            message.channel.send("All messages cleared from Bunch Bot!");
          })
        .catch(val => {
          message.channel.send("Error clearing messages.\n" + val);
        });
        break;

      case "help":
        message.channel.send('We still working but you can respond to this: https://docs.google.com/forms/d/e/1FAIpQLSeriSPDcuP5bU02vSt8Yczbt2VgAw179o6e0WjTT9iWt5lG2A/viewform?usp=sf_link');
        break;

      case "atme":
        message.channel.send(`<@${message.author.id}> is an attention whore or lonely...`);
        break;

      case "relay":
        if(cmd.length>3){
          console.log(cmd[1].substring(2,cmd[1].length-1));
          if(cmd[1].includes("#")){
            message.client.channels.get(cmd[1].substring(2,cmd[1].length-1)).send(cmd.splice(2,cmd.length-2).join(" "));
          }else if(cmd[1].includes("@!") || cmd[1].includes("@")){

          }
        }else{
          message.channel.send("Relay requires 2 paramaters: <channel> <message>");
        }
        break;

      case "join":
        let joinChannel = message.member.voiceChannel;
        joinChannel.join()
        .then(conn => {
          console.log("Connected");
        }).catch(console.error);
        break;

      case "leave":
        let leaveChannel = bot.channels.get(message.member.voiceChannelID);
        leaveChannel.leave();
        break;

      case "ment":
        if(cmd[1]){
          var references = JSON.parse(fs.readFileSync("games.json", "UTF8"));
          switch(cmd[1]){
            case "random":
              if(Object.keys(references).length>0){
                var rand = Object.keys(references)[Math.floor(Math.random()*Object.keys(references).length)];
                if(rand.length>0) message.channel.send("Random mention from data: " + rand + " | <@" + references[rand].join(">, <@") + ">");
                else message.channel.send(rand + " doesn't have any members. Consider adding some or removing the mention.");
              }else{
                message.channel.send("No mentions exist, add one using $ment add name");
              }
              break;
            case "add":
              if(cmd[3]){
                if(references[cmd[2]]){
                  //If reference exists
                  //Add user
                  let rawUser = cmd[3].substring((cmd[3].includes("!") ? 3 : 2), cmd[3].length-1);
                  if(!references[cmd[2]].includes(rawUser)){
                    //Add reference
                    references[cmd[2]].push(rawUser);
                    fs.writeFileSync("games.json", JSON.stringify(references));
                    message.channel.send(cmd[3] + " was added to " + cmd[2]);
                  }else{
                    //Entry already exists
                    message.channel.send(cmd[3] + " already exists in this set.");
                  }
                }else{
                  //Mention doesnt exist
                  message.channel.send("\"" + cmd[2] + " is not a valid category. Use \"$ment list\" for a list.");
                }
              }else if(cmd[2]){
                //Add category
                if(!references[cmd[2]]){
                  //Add reference
                  references[cmd[2]] = [];
                  fs.writeFileSync("games.json", JSON.stringify(references));
                  message.channel.send(cmd[2] + " was added to the mention list.");
                }else{
                  //Already exists
                  message.channel.send(cmd[2] + " already exists.");
                }
              }else{
                //Insufficent paramaters
                message.channel.send("\"$ment remove\" requires one paramater: <list>; or <list> <@user>");
              }
              break;
            case "remove":
            if(cmd[3]){
              if(references[cmd[2]]){
                //If reference exists
                //Remove user
                let rawUser = cmd[3].substring((cmd[3].includes("!") ? 3 : 2), cmd[3].length-1);
                if(references[cmd[2]].includes(rawUser)){
                  //Remove reference
                  references[cmd[2]].push(rawUser);
                  fs.writeFileSync("games.json", JSON.stringify(references));
                  message.channel.send(cmd[3] + " was removed from " + cmd[2]);
                }else{
                  //Entry doesnt exist
                  message.channel.send(cmd[3] + " doesn't exist in this set.");
                }
              }else{
                //Mention doesnt exist
                message.channel.send("\"" + cmd[2] + " is not a valid category. Use \"$ment list\" for a list.");
              }
            }else if(cmd[2]){
              //Remove category
              if(references[cmd[2]]){
                //Remove reference
                delete references[cmd[2]];
                fs.writeFileSync("games.json", JSON.stringify(references));
                message.channel.send(cmd[2] + " was removed from the mention list.");
              }else{
                //Doesnt exist
                message.channel.send(cmd[2] + " is not a valid category to remove.");
              }
            }else{
              //Insufficent paramaters
              message.channel.send("\"$ment remove\" requires one paramater: <list>; or <list> <@user>");
            }
              break;
            case "list":
              message.channel.send("All mentions: " + Object.keys(references).join(", "));
              break;
            default:
              if(Object.keys(references).includes(cmd[1]) && Object.keys(references).length>0){
                let players = references[cmd[1]];
                let str = `<@${players[0]}>`;
                for(var i = 1; i<players.length;i++){
                  str += ` <@${players[i]}>`;
                }
                message.channel.send("Y'all,  " + cmd[1] + ": " + str);
              }else{
                message.channel.send("That mention doesn't exist or is empty <@!" + message.author.id + ">");
              }
              break;
            }
          }else{
            message.channel.send("Mention must have a valid paramater: \"random\", \"add\", \"remove\", \"list\", or <game>.");
          }
        break;

      case "music":
        message.channel.send("I don't get paid enough for this shit");
        break;

      case "ping":
        message.channel.send(bot.ping);
        break;

      case "random":
        if(cmd.length>1){
          var count = 1;
          if(cmd[2]) count = cmd[2];

          var ret = count + " Random number(s) from ";
          var bot, range;
          bot = cmd[1].split("-");

          ret+= bot[0] + " to " + bot[1] + ": *";
          range = parseInt(bot[1]-bot[0]+1);
          bot = parseInt(bot[0]);

          while(count>0){
            ret+= (Math.floor(Math.random()*range)+bot).toString() + ", ";
            count--;
          }

          message.channel.send(ret.substring(0,ret.length-2)+"*");
        }else{
          message.channel.send("Random requires 1 paramater: Range: <bottom>-<top>");
        }
        break;

      case "gay":
        //let members = bot.servers.members;
        console.log(message.channel);
        //message.channel.send((members[Math.floor(Math.random()*members.length)].username) + " is gay!");
        break;

      case "why":
        message.channel.send("Because Colton wanted to make it before William. Fuck you William.");
        break;

      case "jay":
        if(cmd[2] && cmd[2]=="fuck") message.channel.send("<@!317864998728761344> is better than <@!375534890516480002>");
        else message.channel.send("<@!317864998728761344> is better than <@!375534890516480002>");
        break;

      case "fuck":
        if(cmd[1]) message.channel.send("Fuck you " + cmd[1] + ", no homo.");
        else message.channel.send("Fuck requires 1 paramater: @User");
        break;

      case "memify":
      case "memeify":
        if(cmd[1]){
          for(var i=2;cmd[i];i++){
            cmd[1] += " " + cmd[i];
          }

          cmd[1] = cmd[1].toUpperCase();
          var ret = cmd[1].charAt(0);

          for(var i=1;i<cmd[1].length;i++){
            ret += " " + cmd[1].charAt(i);
          }
          ret = ret.replace(/ B /, " :b: ");
          message.channel.send(ret);
        }else{
          message.channel.send("Memify requires 1 :b:aramater: Text");
        }
        break;

      case "version":
        message.channel.send("v0.1.0 Alpha");
        break;

      case "connection":
        message.channel.send("Connection: " + this.ping);
        break;

      case "reference":
        if(cmd.length==1)message.channel.send("");
        break;

      case "ping":
        message.channel.send("Fuck you");
        break;

      default:
        console.log(message.author.id);
        message.channel.send(`"${cmd}" is not a valid command <@${message.author.id}>`);
        break;
    }
  }
}

bot.login('MzE3ODY0OTk4NzI4NzYxMzQ0.DOUzWQ.I5BPMCtejrCLZ51_otLQVcGErKA');
