import { EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";

export default new Event({
    name: "emojiCreate",
    run: async (client, emoji) => {
        const embed = new EmbedBuilder()
            .setTitle("Emoji Created")
            .setColor(Number(0x5ac18e))
            .setDescription(`Emoji **${emoji.name}** has been created`)
            .setThumbnail(emoji.url)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
