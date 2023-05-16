const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { isJSONEncodable } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
            .setName('poll')
            .setDescription('Créer un sondage')
            .addStringOption(option => option.setName('question').setRequired(true).setDescription('Question'))
            .addStringOption(option => option.setName('a1').setRequired(true).setDescription("Premier choix"))
            .addStringOption(option => option.setName('a2').setRequired(true).setDescription("Deuxième choix"))
            .addStringOption(option => option.setName('a3').setRequired(false).setDescription("Troisième choix"))
            .addStringOption(option => option.setName('a4').setRequired(false).setDescription("Quatrième choix")),
        execute: async (interaction) => {
            const user = interaction.user
            const question = interaction.options.getString('question')
            const a1 = interaction.options.getString('a1')
            const a2 = interaction.options.getString('a2')
            const a3 = interaction.options.getString('a3')
            const a4 = interaction.options.getString('a4')

            const choices = []
            if (a1) choices.push(a1)
            if (a2) choices.push(a2)
            if (a3) choices.push(a3)
            if (a4) choices.push(a4)

            try {
                const embed = new EmbedBuilder()
                  .setColor(0x18e1ee)
                  .setAuthor({name:user.username, iconURL:user.displayAvatarURL(), url:user.displayAvatarURL()})
                  .setTitle(`${question}`)
                  .addFields(
                    {name: `1️⃣ ${choices[0]}`, value: ' ', inline: false},
                    {name: `2️⃣ ${choices[1]}`, value: ' ', inline: false}
                  );
                if (a3) embed.addFields({name: `3️⃣ ${choices[2]}`, value: ' ', inline: false});
                if (a4) embed.addFields({name: `4️⃣ ${choices[3]}`, value: ' ', inline: false});
                            
                const message = await interaction.reply({ embeds: [embed], fetchReply: true });
                message.react('1️⃣')
                message.react('2️⃣')
                if (a3) message.react('3️⃣')
                if (a4) message.react('4️⃣')
              } catch (error) {
                console.error(error);
              }
          }
}
