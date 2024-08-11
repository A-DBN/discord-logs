import { Event } from "../classes/events";
import { EmbedBuilder } from "discord.js";

export default new Event({
    name: "emojiUpdate",
    run: async (client, oldEmoji, newEmoji) => {
        if (oldEmoji.name !== newEmoji.name) {
            const embed = new EmbedBuilder()
                .setTitle("Emoji Updated")
                .setDescription(`${oldEmoji.name} has been updated to ${newEmoji.name}`)
                .setColor(Number(0xffdf00))
                .setTimestamp();
            client.chans.get("logs")?.send({ embeds: [embed] });
            client.saveData();
        }
    },
});
