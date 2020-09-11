/*
  > Index.Js is the entry point of our application.
*/
// We import the modules.
const Discord = require("discord.js");
const fs = require('fs');
const config = require("./config");
const Dashboard = require("./dashboard/dashboard");

// We instiate the bot and connect to database.
const bot = new Discord.Client();
bot.config = config;

// We listen for bot's ready event.
bot.on("ready", () => {
  console.log(`Bot is ready. (${bot.guilds.cache.size} Guilds - ${bot.channels.cache.size} Channels - ${bot.users.cache.size} Users)`);
  Dashboard(bot);
});

// We listen for message events.
bot.on("message", async (message) => {
  // Declaring a reply function for easier replies - we grab all arguments provided into the function and we pass them to message.channel.send function.
  const reply = (...arguments) => message.channel.send(...arguments);

  // Doing some basic command logic.
  if (message.author.bot) return;
  if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

  // Get the id of the server and set the standard prefix as bot prefix for the bot
  let prefixJson = require('./json/prefix.json')

  if(!prefixJson[message.guild.id]) {
    prefixJson[message.guild.id] = {
      prefix: "!"
    }
  }

  fs.writeFile("./json/prefix.json", JSON.stringify(prefixJson), (err) => {
    if (err) console.log(err);
  });

  // If the message does not start with the prefix stored in the json, we ignore the message.
  if (message.content.startsWith(prefixJson[message.guild.id].prefix)) return;

  var messageArray = message.content.split(" ");
  var command = messageArray[0];
  var arguments = messageArray.slice(1);


  let commands = bot.commands.find(botcmd => {
      if (botcmd.help.name == command.slice(prefix.length)) return true;
      if (botcmd.help.alias) return botcmd.help.alias.includes(command.slice(prefix.length));
  })

  if(commands) commands.run(bot,message, arguments);
});

// Listening for error & warn events.
bot.on("error", console.error);
bot.on("warn", console.warn);

// We login into the bot.
bot.login(config.token);