import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "messageDelete",
    run: async (client, message) => {
        if (message.channel.id === client.chans.get("log")?.id) return;
        const embed = new EmbedBuilder()
            .setTitle(`Message Deleted in #${message.channel.name}`)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`${message.content}`)
            .setColor(0xed1c24)
            .setTimestamp();
        try {
            client.chans.get("logs")?.send({ embeds: [embed] });
            client.saveData();
        } catch (error) {
            console.error(error);
        }
    },
});
