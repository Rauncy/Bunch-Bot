"use strict";
const fs = require('fs');
/*
Permissions are stored as a string of allowed and disallowed users on a server to server basis
Role specific and user specific
Sub-command specific permissions on request
Slow mode or anti-spam

Permissions are not stored in the perms.js script but instead in the respective files and utilized by the interactivity.js in the root directory
*/

/*
Perms is separated into the following structure
{serverid:{commands:{name:perm}, custcommands:{name:perm}, response:{name:perm}, levels:{id:level}}
*/
var perms = {};

exports.loadPerms = function(server){
  fs.readFile(`./content/${server.id}/perms.json`, 'utf8', (err, data) => {
    if(err){
      perms[server.id]={commands:{}, custcommands:{}, response:{}, level:{}};
      console.log("Created new server " + server.id);
    }
    else if(!perms[server.id]) perms[server.id] = JSON.parse(data);
    else console.log("Data is already loaded for server " + server.id);
  });
}

exports.savePerms = function(server){
  if(perms[server.id]) fs.writeFile(`./content/${server.id}/perms.json`, JSON.stringify(perms[server.id]), err => {
    if(err) console.error(err);
  });
}

exports.saveAllPerms = function(){
  let res = Object.keys(perms);
  for(i in res){
    fs.writeFile(`./content/${server.id}/perms.json`, JSON.stringify(perms[server.id]), err => {
      if(err) console.error(err);
    });
  }
}

//Permission object
exports.Permission = function(){
  //Lower levels are better, lowest being 0
  this.level = undefined;
  //Perms preceded level, level is only viable when there is no data for the user or their role on perms
  this.perms = {roles : [], users : []};
}

exports.hasPermission = function(user, type, name, server){

  //preliminary elimination check
  //1. valid id, 2. valid perm, 3. user is in server
  if(!/\d{18}/.test(user.id) || !perm || !(server.members.has(user)||server.roles.has(user))) return false;

  if(perms[server.id][type][name]){
    //perm exists
    if(perms[server.id][type][name].users.includes(/[ie]{1}\d{18}/)){
      //user match
      return perms[server.id][type][name].users[users.indexOf(/[ie]{1}\d{18}/)]=="i"+user.id;
    }else if(perms[server.id][type][name].roles.includes(/[ie]{1}\d{18}/)){
      //user match
      return perms[server.id][type][name].roles[users.indexOf(/[ie]{1}\d{18}/)]=="i"+user.id;
    }
  }
  else{
    //use level
    if(perms[server.id].levels[user.id]){
      //if has custom levels for roles/users
      return perms[server.id].levels[user.id]
    }else return -1;
  }
}

exports.definePermission = function(user, runnable, server){
  var is = hasPermission(user, command, server);
}

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
}

exports.disallow = function(id, perm){
  permit(id, "e", perm);
}

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
}

exports.getRaw = function(perm){
  return JSON.stringify(perm.perms);
}

exports.setRaw = function(raw, perm){
  perm.perms = JSON.parse(raw);
}

exports.setLevel = function(level, perm){perm.level = level}
exports.removeLevel = function(perm){perm.level = undefined}
