import { Event } from "../classes/events";
import { checkWordsinArray } from "../../utils/utils";

export default new Event({
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot) return;
        const result = checkWordsinArray(client, message.content);
        if (result) {
            const msg = {
                content: result.message ? result.message : " ",
                files: result.attachment ? [result.attachment] : [],
            };
            message.channel.send(msg);
        }
    },
});
