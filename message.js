const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent], });
const rolesData = require('./Stockage/roles.json');
const env = require('dotenv').config();
const fs = require('fs');

function updateIDS(msg) {

}

function setButtonStyle(style) {
    switch (style) {
        case 'PRIMARY':
            return ButtonStyle.Primary;
        case 'SECONDARY':
            return ButtonStyle.Secondary;
        case 'SUCCESS':
            return ButtonStyle.Success;
        case 'DANGER':
            return ButtonStyle.Danger;
        case 'LINK':
            return ButtonStyle.Link;
        default:
            return ButtonStyle.Primary;
    }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.content === '!sendEmbed' && message.channel.id === "980471046815772717") {
    message.delete();

    let description = "Pour être notifié ou invité par ceux qui jouent aux mêmes jeux.\n"
    const embedBuilder = new EmbedBuilder()
      .setTitle('Rôles de jeux')
      .setDescription(description)
      .setColor(0xae6dff)

    embedBuilder.setImage('https://media.tenor.com/imCqsaxJQlMAAAAC/kaisa.gif'); // Replace the URL with your desired GIF image

    const embed = embedBuilder.toJSON();

    const buttonsRow = new ActionRowBuilder();

    rolesData.roles.forEach(roleObj => {
      const button = new ButtonBuilder()
        .setCustomId(roleObj.name)
        .setLabel(roleObj.name)
        .setStyle(setButtonStyle(roleObj.color))
        .setEmoji(roleObj.icon_name);
      buttonsRow.addComponents(button);
    });

    message.channel.send({ embeds: [embed], components: [buttonsRow] }).then(msg => {
        return fs.readFile('./Stockage/ids.json', 'utf-8', (err, data) => {
          if (err) throw err;
          let ids = JSON.parse(data);
          ids.roleEmbedId = msg.id;
          fs.writeFile('./Stockage/ids.json', JSON.stringify(ids, null, 4), (err) => {
            if (err) throw err;
          });
        });
      });      
  }
});

client.login(process.env.token); // Replace with your bot token
