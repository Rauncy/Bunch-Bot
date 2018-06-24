exports.perms = require("./interactivity/perm.js");
exports.commands = require("./interactivity/command.js");
exports.globals = {};

//VOLATILE IS TO REMOVE THE STATUS AFTER A CERTAIN TIME AND REMOVE REMOVES THE STATUS INSTANTLY OR IF ANOTHER IS APPLIED AND IT REMOVES CORRECTLY

allListenerKets = {

}

listeners = {};

exports.hasListener = (gid, uid)=>{
  if(listeners[gid]&&listeners[gid][uid]) return true;
  else return false;
};

exports.getListener = (gid, uid)=>{
  if(hasListener(gid, uid)) return listeners[gid][uid];
  else return null;
};

exports.removeListener = (gid, uid)=>{
  if(hasListener(gid, uid)){
    if(listeners[gid][uid].volatile){
      listeners[gid][uid].remove(listeners[gid][uid].volatile);
    }
    let ret = listeners[gid][uid];
    delete listeners[gid][uid];

    if(Object.keys(listeners[gid]).length === 0) delete listeners[gid];

    return ret;
  }
};

exports.addListener = (gid, uid, type, ...params)=>{
  //CLEANUP PREVIOUS
  if(hasListener(gid, uid)) removeListener(gid, uid);
  listener[gid][uid] = {name : type}
  if(params.length>0) listener[gid][uid].volatile = botListenerKeys[type].volatile(params[0]);
};

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
