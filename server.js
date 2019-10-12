const root = GetResourcePath(GetCurrentResourceName());
const chalk = require('chalk');
var fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

////////////////////////////////////////
//  Load our config file
////////////////////////////////////////
global.Config = {};
fs.readFile(root+'/config.json', 'utf8', function (err, data) {
  if (err) throw err;
  Config = JSON.parse(data);
  console.log(chalk.green('[Whitelist-Plus]: ')+"Config Loaded");
  client.login(Config.DiscordToken);
});

client.on('ready', () => {
  console.log(chalk.green('[Whitelist-Plus]: ')+`Discord client `+chalk.green(`Logged in`)+` as ${client.user.tag}!`);
  client.user.setActivity(Config.DiscordStatus);
});

client.on('message', message => {
  if (message.author.bot) return;
  // This is where we'll put our code.
  if (message.content.indexOf(Config.commandDelimeter) !== 0) return; // check if it has a delimeter or not, if not just stop workign now.

  const args = message.content.slice(Config.commandDelimeter.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === 'ping') {
    message.channel.send('Pong!');
  } else
  if (command === 'whitelist') {
    var id = args[0].replace(/\D/g,'');
    controlWhitelist('ADD', id, message, args)
    //console.log(args)
  }
  if (command === 'ban') {
    var id = args[0].replace(/\D/g,'');
    controlWhitelist('REM', id, message, args)
  }
})

function controlWhitelist(action, id, message, args) {
  switch (action) {
    case "ADD":
      Config.WhitelistedUsers.push('discord:'+id);
      message.channel.send('User '+args[0]+' has been whitelisted.');
      saveConfig();
      break;
    case "REM":
      for(var i = Config.WhitelistedUsers.length - 1; i >= 0; i--) {
        if(Config.WhitelistedUsers[i] === ('discord:'+id)) {
           Config.WhitelistedUsers.splice(i, 1);
        }
      }
      Config.BannedUsers.push('discord:'+id);
      message.channel.send('User '+args[0]+' has been banned.');
      saveConfig();
      break;
    default:

  }
}

function saveConfig() {
  var json = JSON.stringify(Config, null, 4); //convert it back to json
  fs.writeFile(root+'/config.json', json, 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
  });
}

//
//
//

on('playerConnecting', (name, setKickReason) => {
  var plr = {};
  var src = source;
  plr.src = source;
  plr.name = name;
  plr.id = {};
  for (var i = 0; i < i+1; i++) {
    var identifier = GetPlayerIdentifier(source, i)
    if (identifier == null) {
      break;
    } else if (identifier.includes('steam:')) {
      plr.id.steam = identifier;
    } else if (identifier.includes('license:')) {
      plr.id.license = identifier;
    } else if (identifier.includes('xbl:')) {
      plr.id.xboxlive = identifier;
    } else if (identifier.includes('live:')) {
      plr.id.live = identifier;
    } else if (identifier.includes('discord:')) {
      plr.id.discord = identifier;
    } else if (identifier.includes('fivem:')) {
      plr.id.fivem = identifier;
    } else if (identifier.includes('ip:')) {
      plr.id.ip = identifier;
    }
  }
  if (plr.id.discord.indexOf('discord') === -1) {
    console.log("Player Does not have discord running");
    setKickReason("Unable to find DiscordID, please relaunch FiveM with discord open or restart FiveM & Discord if Discord is already open");
    CancelEvent();
    return;
  }
  var found = false;
  for (var i = 0; i < Config.WhitelistedUsers.length; i++) {
    if (plr.id.discord == Config.WhitelistedUsers[i]) {
      found = true;
    }
  }
  if (!found) {
    console.log(chalk.red("User "+plr.name+" is NOT whitelisted."))
    setKickReason("This is a Whitelisted server. Discord.gg/dUs846t to Apply!");
    CancelEvent();
  } else {
    console.log(chalk.green("Player "+plr.name+" is whitelisted to join!"))
  }

  console.log(plr)
});
