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

exports.loadPerms = function(server){
  fs.readFile(`./interactivity/content/${server.id}/perms.json`, 'utf8', (err, data) => {
    if(err){
      perms[server.id]={commands:{}, custcommands:{}, responses:{}, levels:{}};
      perms[server.id].levels[server.owner.id] = 0;
      console.log("Created new perms for server " + server.id);
      //TODO dm permission tutorial to owner
    }
    else if(!perms[server.id]) perms[server.id] = JSON.parse(data);
    else console.log("Data is already loaded for server " + server.id);
  });
};

exports.savePerms = function(server){
  //Make folder if needed
  if(!fs.existsSync(`./interactivity/content/${server.id}`)) fs.mkdir(`./interactivity/content/${server.id}`);
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
exports.Permission = function(){
  //Lower levels are better, lowest being 0
  this.level = undefined;
  //Perms preceded level, level is only viable when there is no data for the user or their role on perms
  this.perms = {roles : [], users : []};
};

exports.defineType = function(s){
  if(s.startsWith("$")){
    if(Object.keys(cmd.commands).includes(cmd.DELIMITER + s)) return "commands";
    return "custcommands";
  }
  return "responses";
};

exports.definePermission = function(server, name){
  let type = exports.defineType(name);
  if(perms[server.id][type][name]) return perms[server.id][type][name];
  return null;
};

//TODO add owner override
exports.hasPermission = function(user, name, server){
  //preliminary elimination check
  let p = exports.definePermission(server, name);

  //1. valid id, 2. valid perm, 3. user is in server
  if(!/\d{18}/.test(user.id) || !p || !(server.members.has(user)||server.roles.has(user))) return false;

  var type = exports.defineType(name);
  if(p){
    //perm exists
    if(p.users.includes(/[ie]{1}\d{18}/)){
      //user match
      return p.users[users.indexOf(/[ie]{1}\d{18}/)]=="i"+user.id;
    }else if(p.roles.includes(/[ie]{1}\d{18}/)){
      //role match
      return p.roles[users.indexOf(/[ie]{1}\d{18}/)]=="i"+user.id;
    }else{
      //use level
      if(perms[server.id].levels[user.id]){
        //if has custom levels for roles/users
        if(p.level != -1) return perms[server.id].levels[user.id] <= p.level;
      }
    }
  }else return false;
};

/*
Returns a boolean in regard to if the event was successful in allowing the paramater
Takes a user or a role and modifies it to the specified permission
Only use prefixes i or e or else permissions break
*/
function permit(id, prefix, perm){
  var short;
  if(/<@&\d{18}>/.test(id)){
    //is role
    short = id.substring(3, 20);
    removePerms(short, perm.perms.roles);
    perm.perms.roles.push(prefix + short);
    return true;
  }else if(/<@!?\d{18}>/.test(id)){
    //is username or nick
    short = id.substring(id.length-18, id.length-1);
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
  arr.some((v, i) => {
     if(regex.test(v)){
       arr.splice(i, 1);
       return true;
     }
  });
}

exports.allow = function(id, perm){
  permit(id, "i", perm);
};

exports.disallow = function(id, perm){
  permit(id, "e", perm);
};

exports.remove = function(id, perm){
  if(/<@&\d{18}>/.test(id)){
    //is role
    return removePerms(id.substring(3, 20), perm.perms.roles);
  }else if(/<@!?\d{18}>/.test(id)){
    //is username or nick
    return removePerms(id.substring(id.length-18, id.length-1), perm.perms.users);
  }else{
    //is neither
    return false;
  }
};

exports.getRaw = function(perm){
  return JSON.stringify(perm.perms);
};

exports.setRaw = function(raw, perm){
  perm.perms = JSON.parse(raw);
};

exports.setLevel = function(level, perm){perm.level = level};
exports.removeLevel = function(perm){perm.level = undefined};
