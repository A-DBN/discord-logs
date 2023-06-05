const { SlashCommandBuilder } = require('@discordjs/builders')
const { ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const fs = require('fs')


let players = []

module.exports = {
    data: new SlashCommandBuilder()
            .setName('fivestack')
            .setDescription('Organise un five stack')
            .addStringOption(option => option.setName('jeu').setDescription('Le jeu auquel vous voulez jouer').setRequired(true))
            .addStringOption(option => option.setName('team').setDescription('Le nom de la team').setRequired(true))
            .addStringOption(option => option.setName('date').setDescription('La date à laquelle vous voulez jouer (Format: JJ/MM/AAAA)').setRequired(true))
            .addStringOption(option => option.setName('heure').setDescription('L\'heure à laquelle vous voulez jouer (Format: HH:MM)').setRequired(true)),
        execute: async (interaction) => {
            const jeu = interaction.options.getString('jeu')
            const team = interaction.options.getString('team')
            const date = interaction.options.getString('date')
            const heure = interaction.options.getString('heure')
            const user = interaction.user

            players = []
            players.push(user.id)
            global.players = players

            let description = `Jeu: \`${jeu}\`\nNom de la Team: \`${team}\`\nDate: \`Le ${date} à ${heure}\`\n------------\n`
            const embed = new EmbedBuilder()
            .setColor(0x18e1ee)
            .setAuthor({name:user.username, iconURL:user.displayAvatarURL(), url:user.displayAvatarURL()})
            .setTitle(`Five Stack organisé par ${user.username}`)
            .setDescription(description)
            .addFields(
                {name: `‎ `, value: `<@${user.id}>`, inline: true}
            )
            .setTimestamp()
            .setFooter({text:'Utilisez les boutons pour rejoindre ou quitter le five stack'})

            const embedBuilder = embed.toJSON();

            const buttonsRow = new ActionRowBuilder();
            const join = new ButtonBuilder()
                .setCustomId("Join")
                .setLabel("Rejoindre")
                .setStyle(ButtonStyle.Primary)
            
            const leave = new ButtonBuilder()
                .setCustomId("Leave")
                .setLabel("Quitter")
                .setStyle(ButtonStyle.Danger)
              
            buttonsRow.addComponents([join, leave]);

            interaction.reply({ embeds: [embedBuilder], components: [buttonsRow] });
            interaction.deleteReply({setTimeout: 60 * 30 * 1000})
        }
}
