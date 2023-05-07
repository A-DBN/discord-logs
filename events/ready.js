const {MessageEmbed} = require("discord.js");
const env = require ('dotenv').config()

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready to work ! Logged in as ${client.user.tag}`)
	const embed = new MessageEmbed()
        .setTitle('Redemarrage du bot')
        .setColor('#5ac18e')
        .setDescription(`Redemarrage du bot terminé, si le bot redemarre regulierement ou après une certaine action => mp ZenkiuD#3333`)
        .setTimestamp()
        if (embed.description)
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});

    }
}
