const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'roleCreate',
    on: true,
    execute(role) {
        if (getObject('roleCreate').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Role Created')
        .setColor(Number(0x5ac18e))
        .setAuthor({name: role.client.user.username, iconURL:role.client.user.displayAvatarURL()})
        .setDescription(`Role **${role.name}** was created`)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}