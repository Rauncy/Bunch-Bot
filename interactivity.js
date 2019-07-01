//START NEW CODE
exports.perms = require("./interactivity/perm.js");
exports.commands = require("./interactivity/command.js");

exports.globals = {};

var listeners = {};

//listenerKeys contains all the possible manners how the bot will handle user input from chat
//volatile is what will run when the key is given to a user and remove runs when the title is removed

var listenerKeys = {
  "cmdRedirect" : {
    volatile : (params)=>{
      return params;
    },
    remove : ()=>{}
  },
  "silence" : {
    volatile : (params)=>{

    },
    remove : ()=>{}
  },
  "ignore" : {
    volatile : (params)=>{

    },
    remove : ()=>{}
  }
};

exports.hasListener = (gid, uid)=>{
  if(listeners[gid]&&listeners[gid][uid]) return true;
  else return false;
};

exports.getListener = (gid, uid)=>{
  if(exports.hasListener(gid, uid)) return listeners[gid][uid];
  else return null;
};

exports.removeListener = (gid, uid)=>{
  if(exports.hasListener(gid, uid)){
    if(listeners[gid][uid].volatile){
      listeners[gid][uid].remove(listeners[gid][uid].volatile);
    }
    let ret = listeners[gid][uid];
    delete listeners[gid][uid];

    if(Object.keys(listeners[gid]).length === 0) delete listeners[gid];

    return ret;
  }else return null;
};

exports.addListener = (gid, uid, type, ...params)=>{
  //CLEANUP PREVIOUS
  if(exports.hasListener(gid, uid)) exports.removeListener(gid, uid);

  listener[gid][uid] = {name : type}
  if(params.length>0) listener[gid][uid].volatile = botListenerKeys[type].volatile(params);
};

//START OLD CODE
exports.perms = require("./interactivity/perm.js");
exports.commands = require("./interactivity/command.js");
exports.globals = {};

//VOLATILE IS TO REMOVE THE STATUS AFTER A CERTAIN TIME AND REMOVE REMOVES THE STATUS INSTANTLY OR IF ANOTHER IS APPLIED AND IT REMOVES CORRECTLY

allListenerKits = {

}

listeners = {};

botListenerKeys = {
  "poll" : {
    volatile : (time)=>{
      return setTimeout(()=>{
        exports.removeListener(gid, uid);
      }, time*1000);
    },
    remove : (vol)=>{
      clearTimeout(vol);
    }
  },
  "ban" : {}
};

generalListenerKeys = [
  "spam"
];
