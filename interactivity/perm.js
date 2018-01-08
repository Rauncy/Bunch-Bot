"use strict";
const fs = require('fs');
const cmd = require('./command.js');
/*
Permissions are stored as a string of allowed and disallowed users on a server to server basis
Role specific and user specific
Sub-command specific permissions on request
Slow mode or anti-spam

Permissions are not stored in the perms.js script but instead in the respective files and utilized by the interactivity.js in the root directory
*/

/*
Perms is separated into the following structure
{serverid:{commands:{name:perm}, custcommands:{name:perm}, responses:{name:perm}, levels:{id:level}}
*/
var perms = {};

exports.isLoaded = function(server){
  return (perms[server.id] ? true : false);
}

exports.loadPerms = function(server){
  console.log("LOAD");
  if(!fs.existsSync(`./interactivity/content/${server.id}/perms.json`)){
    perms[server.id]={commands:{$perms:{level:-1,perms:{roles:[],users:["i"+server.owner.id]}}}, custcommands:{}, responses:{}, levels:{}};
    perms[server.id].levels[server.owner.id] = -1;
    if(!fs.existsSync(`./interactivity/content/${server.id}`)) fs.mkdir(`./interactivity/content/${server.id}`);
    fs.open(`./interactivity/content/${server.id}/perms.json`, 'a', (err, file) => {
      if(err) throw err;
      else{
        exports.savePerms(server);
        console.log("Created new perms for server " + server.id);
      }
    });
    //TODO dm permission tutorial to owner
  }
  else if(!perms[server.id]){
    perms[server.id] = JSON.parse(fs.readFileSync(`./interactivity/content/${server.id}/perms.json`, 'utf8'));
  }
  else console.log("Data is already loaded for server " + server.id);
};

exports.savePerms = function(server){
  //Set files in dir
  if(perms[server.id]) fs.writeFile(`./interactivity/content/${server.id}/perms.json`, JSON.stringify(perms[server.id]), err => {
    if(err) console.error(err);
  });
};

exports.saveAllPerms = function(){
  let res = Object.keys(perms);
  for(i in res){
    fs.writeFile(`./interactivity/content/${server.id}/perms.json`, JSON.stringify(perms[server.id]), err => {
      if(err) console.error(err);
    });
  }
};

//Permission object
function Permission(){
  //Lower levels are better, lowest being 0
  this.level = 0;
  //Perms preceded level, level is only viable when there is no data for the user or their role on perms
  this.perms = {roles : [], users : []};
};

exports.defineType = function(s){
  if(s.startsWith(cmd.DELIMITER)){
    if(cmd.list().some(val => {
      return val.startsWith(s.substring(cmd.DELIMITER.length));
    })) return "commands";
    else return "custcommands";
  }
  return "responses";
};

exports.definePermission = function(server, name){
  let type = exports.defineType(name);
  if(!perms[server.id][type][name]){
    //Check if name starts with perm
    let best = "";
    Object.keys(perms[server.id][type]).forEach(val => {
      if(name.startsWith(val) && val.length>best.length) best = val;
    });
    if(best.length>0) return perms[server.id][type][best];
    else perms[server.id][type][name] = new Permission();
  }
  return perms[server.id][type][name];
};

//TODO add owner override
exports.hasPermission = function(user, name, server){
  //preliminary elimination check
  let p = exports.definePermission(server, name);
  var short = user.match(/\d{18}/)[0];

  //1. valid id, 2. valid perm, 3. user is in server
  if(!short || !p || !server.members.get(short)) return false;

  var type = exports.defineType(name);

  //perm exists
  var re = new RegExp("[ie]" + short);

  if(p.perms.users.some(val => { return re.test(val); })){
    //user match
    return p.perms.users.includes("i"+short);
  }
  //role match
  var iter = server.members.find("id", short).roles.keys();
  var cur = iter.next().value;
  while(cur){
    var re = new RegExp("[ie]" + cur);

    //if match regex will return
    if(p.perms.roles.some(val => { return re.test(val); })){
      //will return
      return p.perms.roles.includes("i"+cur);
    }
    //else continue
    cur = iter.next().value;
  }

  //use level
  if(!perms[server.id].levels[short]) perms[server.id].levels[short]=0;
  return perms[server.id].levels[short] <= p.level;
};

/*
Returns a boolean in regard to if the event was successful in allowing the paramater
Takes a user or a role and modifies it to the specified permission
Only use prefixes i or e or else permissions break
*/
function permit(id, prefix, perm){
  var short = id.match(/(\d{18})/)[1];
  if(/<@&\d{18}>/.test(id)){
    //is role
    removePerms(short, perm.perms.roles);
    perm.perms.roles.push(prefix + short);
    return true;
  }else if(/<@!?\d{18}>/.test(id)){
    //is username or nick
    removePerms(short, perm.perms.users);
    perm.perms.users.push(prefix + short);
    return true;
  }else{
    //is neither
    return false;
  }
}

function removePerms(id, arr){
  var regex = new RegExp("[ie]{1}" + id);
  return arr.some((v, i) => {
     if(regex.test(v)){
       arr.splice(i, 1);
       return true;
     }
  });
}

exports.allow = function(id, perm){
  return permit(id, "i", perm);
};

exports.disallow = function(id, perm){
  return permit(id, "e", perm);
};

exports.remove = function(id, perm){
  var short = id.match(/\d{18}/)[0];
  if(/<@&\d{18}>/.test(id)){
    //is role
    return removePerms(short, perm.perms.roles);
  }else if(/<@!?\d{18}>/.test(id)){
    //is username or nick
    return removePerms(short, perm.perms.users);
  }else return false;
};

exports.getRaw = function(perm){
  return JSON.stringify(perm.perms);
};

exports.setRaw = function(raw, perm){
  perm.perms = JSON.parse(raw);
};

exports.all = function(server){
  return JSON.stringify(perms[server.id]);
}

exports.setLevel = function(server, id, level){perms[server.id].levels[id] = level;};
exports.removeLevel = function(server, id){delete perms[server.id].levels[id];};
