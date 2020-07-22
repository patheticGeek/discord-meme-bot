require("dotenv").config();
const Discord = require("discord.js");
const MemeAPI = require("./libs/MemeAPI");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Bot readyyyyyyyyyyy!");
});

client.on("message", async (message) => {
  try {
    if (message.content === "!ping") {
      message.channel.send("pong");
    } else if (message.content === "!getmemes") {
      const memes = await MemeAPI.getMemes();
      message.channel.send(`${memes.length} templates cumming your way`);
      const messages = memes.map((meme) => {
        return new Discord.MessageEmbed()
          .setTitle(`${meme.name} - ${meme.id}`)
          .setDescription(`No. of text lines: ${meme.box_count}`)
          .setImage(meme.url);
      });
      await Promise.all(messages.map((msg) => message.channel.send(msg)));
    } else if (message.content.startsWith("!makememe")) {
      const intr = message.content.split("\n");
      if (intr.length < 2) {
        message.channel.send("Please specify atleast one text");
        return;
      }
      const meme = await MemeAPI.makeMeme(parseInt(intr[0].split(" ")[1]), [intr[1], intr[2]]);
      const attachment = new Discord.MessageAttachment(meme);
      message.channel.send(attachment);
    }
  } catch (e) {
    message.channel.send(e.message || "An unknown error occured");
  }
});

if (process.env.DISCORD_BOT_TOKEN) client.login(process.env.DISCORD_BOT_TOKEN);
else console.log("Please add an env var DISCORD_BOT_TOKEN");
