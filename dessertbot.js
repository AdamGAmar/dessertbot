const Util = require("./util.js");
const Dice = require("./dice.js");

const Discord = require("discord.js");

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("DessertBot Ready!");
});

client.on("disconnect", event => {
  console.log("DessertBot disconnected with code: " + event.code + ", cleanly: " + event.wasClean);
  console.log("Reason: " + event.reason);
});

client.on('guildMemberAdd', member => {
  const embed = new Discord.RichEmbed()
    .setColor(0x9B59B6)
    .setTimestamp()
    .addField("Welcome!", `${member.user}, welcome to ${member.guild} :smile:`);
  member.guild.defaultChannel.sendEmbed(embed);
});

client.on('guildMemberRemove', member => {
  const embed = new Discord.RichEmbed()
    .setColor(0x9B59B6)
    .setTimestamp()
    .addField("Hope you've enjoyed your stay!", `${member.user} has left ${member.guild} :frowning:`);
  member.guild.defaultChannel.sendEmbed(embed);
});

client.on("message", message => {
  // Ignore bot messages and non-command messages
  if(message.author.bot || !message.content.startsWith(config.prefix)) {
    return;
  }

  // Split command and arguments
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  const sender = message.member;

  // Perform command
  switch(command) {
    case "help":
    case "commands":
      message.channel.send("!ping - check if DessertBot is still alive\n" +
        "!whois @<member> - user information for <member>\n" +
        "!flip - flip a coin\n" +
        "!roll <dice expression> - roll some dice\n" +
        "!op <summoner> - na.op.gg profile for <summoner>\n" +
        "!champion <champion> - champion.gg stats for <champion>\n" +
        "!sanchez - ???\n" +
        "!jebaited - ???");
      break;

    case "ping":
      message.channel.send("!pong");
      break;

    case "whois":
      if(message.mentions.users.size > 0) {
        let snowflake = message.mentions.users.firstKey();
        if(message.guild.members.has(snowflake)) {
          let member = message.guild.members.get(snowflake);
          let name = (member.nickname != null) ?
            member.nickname + " (" + member.user.username + "#" + member.user.discriminator + ")" :
            member.user.username + "#" + member.user.discriminator;
          message.channel.send(member + " is " + name +
            ", member of " + message.guild.name +
            " since " + member.joinedAt.toDateString() );
        }
      }
      break;
      
    case "flip":
      let flipResult = Util.flip();
      if (sender === null) {
        message.channel.send(flipResult);
      }
      else {
        message.channel.send(sender + " " + flipResult);
      }
      break;
      
    case "roll":
      try {
        let rollResult = Dice.rollDice(args.join(" "));
        if (sender === null) {
          message.channel.send(rollResult);
        }
        else {
          message.channel.send(sender + " rolled " + rollResult);
        }
      }
      catch(error) {
        message.channel.send(sender + " " + error.message);
      }
      break;

    case "op":
      let summonerName = args.join("+");
      message.channel.send("http://na.op.gg/summoner/userName=" + summonerName);
      break;

    case "champion":
      let championName = args.join("").toLowerCase().replace(/[^a-z]/g, '');
      message.channel.send("http://na.op.gg/champion/" + championName + "/statistics");
      break;
    
    case "sanchez":
      let sanchezImage = Util.sanchez();
      message.channel.send("", {
        "files": [sanchezImage]
      });
      break;
      
    case "jebaited":
      let jebaitedImage = Util.jebaited();
      message.channel.send("", {
        "files": [jebaitedImage]
      });
      break;

    default:
      break;
  }
});

client.login(config.discordtoken);