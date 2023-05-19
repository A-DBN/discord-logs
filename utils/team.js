const {EmbedBuilder} = require('discord.js');


function updateEmbed(interaction) {
    let message = interaction.message;
    const embed = interaction.message.embeds[0];
    const components = interaction.message.components;

    const new_embed = new EmbedBuilder()
        .setColor(embed.color)
        .setAuthor({name:embed.author.name, iconURL:embed.author.iconURL, url:embed.author.url})
        .setTitle(embed.title)
        .setDescription(embed.description)
        .setTimestamp()
        .setFooter({text:embed.footer.text})
    players.forEach(player => {
        new_embed.addFields({name: `‎`, value: `<@${player}>`, inline: false})
    })

    message.edit({embeds: [new_embed], components: components})
}

module.exports = {
    updateEmbed
}