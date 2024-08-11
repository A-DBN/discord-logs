import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "channelUpdate",
    run: async (client, oldChannel, newChannel) => {
        const embed = new EmbedBuilder()
            .setTitle("Channel Update")
            .setColor(Number(0xffdf00))
            .setDescription(`Channel **${oldChannel.name}** has been updated to **${newChannel.name}** `)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
