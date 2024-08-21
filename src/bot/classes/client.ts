import { Attachment, Client, Collection, TextChannel } from "discord.js";
import requireAll from "require-all";
import path from "path";

import { handleEvent } from "../handler";
import { Command } from "./command";
import { Event } from "./events";
import { readFileSync, writeFileSync } from "fs";

export type MessageCollection = {
    name: string;
    attachment: Attachment;
    message: string;
};

export default class CustomClient extends Client {
    commands: Collection<string, Command> = new Collection();
    chans: Collection<string, TextChannel> = new Collection();
    reactions: Collection<string, MessageCollection> = new Collection();

    twitchToken: string = "";
    twitchTokenExpiration: number = 0;
    isLive: boolean = false;

    tweetId: string = "";

    constructor() {
        super({
            intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
        });
    }

    async start() {
        await this.resolveModules();
        this.initData();
        await this.login(process.env.TOKEN);
        await this.resolveChannels();
    }

    async resolveChannels() {
        const ids = {
            channels: [
                {
                    name: "logs",
                    id: process.env.LOGS_CHANNEL_ID,
                },
                {
                    name: "twitch",
                    id: process.env.TWITCH_CHANNEL_ID,
                },
                {
                    name: "welcome",
                    id: process.env.WELCOME_CHANNEL_ID,
                },
            ],
        };

        for (const id of ids.channels) {
            const chan = (await this.channels.fetch(id.id!)) as TextChannel;
            this.chans.set(id.name, chan);
        }
    }

    async resolveModules() {
        const sharedSettings = {
            recursive: true,
            filter: /\w*.[tj]s/g,
        };

        // Commands
        requireAll({
            ...sharedSettings,
            dirname: path.join(__dirname, "../commands"),
            resolve: x => {
                const command = x.default as Command;
                console.log(`Command '${command.builder.name}' registered.`);
                this.commands.set(command.builder.name, command);
            },
        });

        // Events
        requireAll({
            ...sharedSettings,
            dirname: path.join(__dirname, "../events"),
            resolve: x => {
                const event = x.default as Event;
                console.log(`Event '${event.name}' registered.`);
                handleEvent(this, event);
            },
        });
    }

    async deployCommands() {
        const guild = this.guilds.cache.get(process.env.GUILD_ID!)!;
        const commandsJSON = [...this.commands.values()].map(x => x.builder.toJSON());
        const commandsCol = await guild.commands.set(commandsJSON);
        console.log(`Deployed ${commandsCol.size} commands.`);
    }

    isSameChannel(channel: TextChannel, channel2: TextChannel) {
        return channel.id === channel2.id;
    }

    saveData() {
        console.log("Saving data...");
        const data = {
            reactions: [...this.reactions.entries()],
            isLive: this.isLive,
            tweetId: this.tweetId,
        };

        writeFileSync("./data/stockage.json", JSON.stringify(data, null, 4));
    }

    initData() {
        const data = JSON.parse(readFileSync("./data/stockage.json", "utf-8"));
        this.twitchToken = "";
        this.twitchTokenExpiration = 0;
        this.isLive = data.isLive || false;
        this.tweetId = data.tweetId || "";
        this.reactions = new Collection(data.reactions);
    }
}
