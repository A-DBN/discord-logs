import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "messageUpdate",
    run: async (client, oldMessage, newMessage) => {
        if (
            !(
                client.isSameChannel(oldMessage.channel, newMessage.channel) &&
                !oldMessage.author.bot &&
                oldMessage.content !== newMessage.content
            )
        )
            return;
        const embed = new EmbedBuilder()
            .setTitle(`Message Updated in #${newMessage.channel.name}`)
            .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL() })
            .setColor(Number(0xffdf00))
            .setDescription(
                `${oldMessage.author} updated a message in ${oldMessage.channel}\n\n**Before**\n${oldMessage.content}\n\n**After**\n${newMessage.content}`
            )
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
