import { Event } from "../classes/events";
import { EmbedBuilder } from "discord.js";

export default new Event({
    name: "emojiDelete",
    run: async (client, emoji) => {
        const embed = new EmbedBuilder()
            .setTitle("Emoji Deleted")
            .setColor(Number(0xed1c24))
            .setDescription(`Emoji ${emoji.name} has been deleted`)
            .setThumbnail(emoji.url)
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });
        client.saveData();
    },
});
