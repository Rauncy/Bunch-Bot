"use strict";
/*
Permissions are stored as a string of allowed and disallowed users on a server to server basis
Role specific and user specific
Sub-command specific permissions on request
Slow mode or anti-spam

Permissions are not stored in the perms.js script but instead in the respective files and utilized by the interactivity.js in the root directory
*/

/*
Levels is separated into the following structure
{serverid:{users:{id:level}, roles:{id:level}}}
*/
var levels = {};
/*
Perms is separated into the following structure
{serverid:{commands:{name:perm}, custcommands:{name:perm}, response:{name:perm}}
*/
var perms = {};

//Permission object
function Permission(){
  //Lower levels are better, lowest being 0
  this.level = undefined;
  //Perms preceded level, level is only viable when there is no data for the user or their role on perms
  this.perms = {roles : [], users : []};
}

function hasPermission(user, type, name, server){
  //preliminary elimination check
  //1. valid id, 2. valid perm, 3. user is in server
  if(!/\d{18}/.test(user.id) || !perm || !server.members.has(user)) return false;

  if(perms[server.id] && perms[server.id][type][name]){
    //perm exists
    if()
  }
  else{
    //use level
    if(levels[server.id]){
      //if has custom levels for roles/users
      var highest = -1;
    }else return user.;
  }
}

function definePermission(user, runnable, server){
  var is = hasPermission(user, command, server);
}

/*
Returns a boolean in regard to if the event was successful in allowing the paramater
Takes a user or a role and modifies it to the specified permission
Only use prefixes i or e or else permissions break
*/
var permit = function(id, prefix, perm){
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

var removePerms = function(id, arr){
  var regex = new RegExp("[ie]{1}" + id);
  arr.some((v, i) => {
     if(regex.test(v)){
       arr.splice(i, 1);
       return true;
     }
  });
}

function allow(id, perm){
  permit(id, "i", perm);
}

function disallow(id, perm){
  permit(id, "e", perm);
}

function remove(id, perm){
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

function getRaw(perm){
  return JSON.stringify(perm.perms);
}

function setRaw(raw, perm){
  perm.perms = JSON.parse(raw);
}

function setLevel(level, perm){perm.level = level}
function removeLevel(perm){perm.level = undefined}
