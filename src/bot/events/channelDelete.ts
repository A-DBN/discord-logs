import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "channelDelete",
    run: async (client, channel) => {
        const embed = new EmbedBuilder()
            .setTitle("Channel Deleted")
            .setColor(Number(0xed1c24))
            .setDescription(`Channel **${channel.name}** was deleted`)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
