const { SlashCommandBuilder } = require('@discordjs/builders');
const {EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const fs = require('fs');

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

function editMessage() {
    const roleEmbedId = require('../Stockage/ids.json').roleEmbedId;
    const targetChannelId = '980527661422108702';
  
    client.channels.fetch(targetChannelId)
      .then(channel => channel.messages.fetch(roleEmbedId))
      .then(message => {
        const rolesData = require('../Stockage/roles.json');
  
        let description = "Pour être notifié ou invité par ceux qui jouent aux mêmes jeux.\n";
        const embedBuilder = new EmbedBuilder()
          .setTitle('Rôles de jeux')
          .setDescription(description)
          .setColor(0xae6dff);
  
        embedBuilder.setImage('https://media.tenor.com/imCqsaxJQlMAAAAC/kaisa.gif');
  
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
  
        return message.edit({ embeds: [embed], components: [buttonsRow] });
      })
      .catch(console.error);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updaterole')
    .setDescription("Rajoute ou Supprime un rôle sur l'embed de choix de rôle")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Ajoute un rôle')
        .addStringOption(option => option.setName('nom').setDescription('Le nom du rôle à rajouter').setRequired(true))
        .addStringOption(option => option.setName('icon').setDescription("L'id de l'icône du rôle (ex: :icon: et copie-colle le résultat)").setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('La couleur du bouton du rôle').setRequired(true).addChoices(
            {name: 'Bleu', value: 'PRIMARY'},
            {name: 'Gris', value: 'SECONDARY'},
            {name: 'Vert', value: 'SUCCESS'},
            {name: 'Rouge', value: 'DANGER'},
        ))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Supprime un rôle')
        .addStringOption(option => option.setName('nom').setDescription('Le nom du rôle à supprimer').setRequired(true))
    ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const nom = interaction.options.getString('nom');
      const icon = interaction.options.getString('icon');
      const color = interaction.options.getString('color');

      const rolesData = require('../Stockage/roles.json');

      const newRole = {
        name: nom,
        icon_name: icon,
        color: color
      };

      rolesData.roles.push(newRole);
      fs.writeFileSync('./Stockage/roles.json', JSON.stringify(rolesData, null, 2));
      editMessage(interaction);
      interaction.reply(`Le rôle "${nom}" a été ajouté avec succès.`);
    } else if (subcommand === 'remove') {
      const nom = interaction.options.getString('nom');
      const rolesData = require('../Stockage/roles.json');
      const roleIndex = rolesData.roles.findIndex(role => role.name === nom);

      if (roleIndex !== -1) {
        rolesData.roles.splice(roleIndex, 1);
        fs.writeFileSync('./Stockage/roles.json', JSON.stringify(rolesData, null, 4));
        editMessage(interaction);
        interaction.reply(`Le rôle "${nom}" a été supprimé avec succès.`);
      } else {
        interaction.reply(`Le rôle "${nom}" n'a pas été trouvé dans la liste des rôles.`);
      }
    } else {
      interaction.reply('Une erreur est survenue pendant l\'exécution de la commande.');
    }
  },
};
