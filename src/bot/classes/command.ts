import { SlashCommandBuilder } from "@discordjs/builders";

import CustomClient from "./client";
import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

export type CommandArgs = {
    client: CustomClient;
    interaction: ChatInputCommandInteraction;
};

export class Command {
    builder: SlashCommandBuilder;

    run: (args: CommandArgs) => void;

    autocomplete?: (client: CustomClient, interaction: AutocompleteInteraction) => void;

    constructor(options: NonNullable<Command>) {
        Object.assign(this, options);
    }

    execute?(args: CommandArgs) {
        this.run!(args);
        args.client.saveData();
    }
}
