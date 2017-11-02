var Discordie = require('discordie');

const Events = Discordie.Events;
const client = new Discordie();

client.connect({
  token: 'MzE3ODY0OTk4NzI4NzYxMzQ0.DNxLuA.lfLoWwqjGSTDrM0ESqs6adVSb0E'
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log('Connected as: ' + client.User.Username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if(e.message.content == 'nigga'){
    e.message.channel.sendMessage('You mean nigger?');
  }
});
