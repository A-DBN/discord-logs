import CustomClient, { MessageCollection } from "../bot/classes/client";

export function setColor() {
    const color = Math.floor(Math.random() * 0xffffff);
    const value = 0;

    if (typeof value === "number") {
        const modifiedColor = color + value;
        const finalColor = Math.max(0, Math.min(modifiedColor, 0xffffff));
        return finalColor.toString(16).padStart(6, "0");
    }
    return Number("0x" + color.toString(16).padStart(6, "0"));
}

export function checkWordsinArray(client: CustomClient, sentence: string): MessageCollection | null {
    const words = sentence.split(/\s+/);

    for (const word of words) {
        const match = client.reactions.find(item => item.name === word);
        if (match) {
            return match;
        }
    }

    return null;
}
