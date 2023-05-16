const { EmbedBuilder } = require('@discordjs/builders');
const env = require ('dotenv').config()
const {getObject} = require('../utils/utils.js')

module.exports = {
    name: 'roleUpdate',
    on: true,
    execute(oldRole, newRole) {
        if (getObject('roleUpdate').enabled === false) return;
        if (oldRole.name !== newRole.name) {
            const embed = new EmbedBuilder()
            .setTitle('Role Updated')
            .setColor(Number(0xffdf00))
            .setAuthor(newRole.client.user.tag, newRole.client.user.displayAvatarURL())
            .setDescription(`Role **${oldRole.name}** was updated to **${newRole.name}**`)
            .setTimestamp()
            if (embed.description !== '')
                client.channels.cache.get(process.env.log_channel_id).send({embeds: [embed]});
        } else {
            return
        }
    }
}