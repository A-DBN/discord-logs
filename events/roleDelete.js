const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'roleDelete',
    on: true,
    execute(role) {
        if (getObject('roleDelete').enabled === false) return;
        const embed = new EmbedBuilder()
        .setTitle('Role Deleted')
        .setColor(Number(0xed1c24))
        .setAuthor(role.client.user.tag, role.client.user.displayAvatarURL())
        .setDescription(`Role **${role.name}** was deleted`)
        .setTimestamp()
        if (embed.description !== '')
            client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
    }
}