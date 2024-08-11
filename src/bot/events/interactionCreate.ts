import { Event } from "../classes/events";
import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../classes/client";
// import { queue, skip, stop, previous, loop, loopqueue } from '../../music/commands';
import { handleCommand } from "../handler";

async function handleAutoComplete(client: CustomClient, interaction: AutocompleteInteraction) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.autocomplete?.(interaction as AutocompleteInteraction);
    } catch (error) {
        console.error(`An error occurred in '${command.builder.name}' command.\n${error}\n`);
    }
}

// function handleMusicButton(client: CustomClient, interaction: ButtonInteraction) {
//     const command = interaction.customId;
//     switch (command) {
//         case 'stop':
//             stop(interaction, client)
//             break;
//         case 'skip':
//             skip(interaction, client)
//             break;
//         case 'previous':
//             previous(interaction, client)
//             break
//         case 'queue':
//             queue(interaction, client)
//             break
//         case 'loop':
//             loop(interaction, client)
//             break
//         case 'loopqueue':
//             loopqueue(interaction, client)
//             break
//     }
// }

export default new Event({
    name: "interactionCreate",
    run: async (client, interaction: ChatInputCommandInteraction | AutocompleteInteraction | ButtonInteraction) => {
        if (interaction.isChatInputCommand()) {
            await handleCommand(client, interaction);
            // } else if (interaction.isButton()) {
            //     await handleMusicButton(client, interaction)
        } else if (interaction.isAutocomplete()) {
            await handleAutoComplete(client, interaction);
        }
    },
});
