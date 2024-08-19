import { ActivityType, EmbedBuilder } from "discord.js";
import { Event } from "../classes/events";
import { CronJob } from "cron";
import { isLive } from "../../utils/twitchAlert";

export default new Event({
    name: "ready",
    run: async client => {
        console.log("Deploying Commands");
        await client.deployCommands();
        console.log("Commands Deployed");
        console.log(`Ready to work ! Logged in as ${client.user?.tag}`);
        client.user?.setActivity("AreiTTV on Twitch", {
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/areittv",
        });
        const embed = new EmbedBuilder()
            .setTitle("Redemarrage du bot")
            .setColor(Number(0x5ac18e))
            .setDescription(
                `Redemarrage du bot terminé, si le bot redemarre regulierement ou après une certaine action => mp ZenkiuD`
            )
            .setTimestamp();
        client.chans.get("logs")?.send({ embeds: [embed] });

        // setup cron job every 5 minutes
        const job = new CronJob("0 */5 * * * *", async () => {
            await isLive(client);
        });

        job.start();
    },
});
