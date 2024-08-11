import { SlashCommandBuilder } from "@discordjs/builders";

import CustomClient from "./client";
import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction } from "discord.js";

export type CommandArgs = {
    client: CustomClient;
    interaction: ChatInputCommandInteraction;
};

export class Command {
    builder: SlashCommandBuilder;

    run: (args: CommandArgs) => void;

    autocomplete?: (interaction: AutocompleteInteraction) => void;

    constructor(options: NonNullable<Command>) {
        Object.assign(this, options);
    }

    execute?(args: CommandArgs) {
        console.log("calling run");
        this.run!(args);
        console.log("calling saveData");
        args.client.saveData();
    }
}
