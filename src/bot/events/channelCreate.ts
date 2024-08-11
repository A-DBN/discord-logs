import { Event } from "../classes/events";
import { EmbedBuilder } from "discord.js";

export default new Event({
    name: "channelCreate",
    run: async (client, channel) => {
        const embed = new EmbedBuilder()
            .setTitle("Channel Created")
            .setColor(Number(0x5ac18e))
            .setDescription(`Channel **${channel.name}** created`)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
