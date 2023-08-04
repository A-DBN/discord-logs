const fs = require('fs')

module.exports = {
    getObject(eventName) {
        const eventsFile = fs.readFileSync('Stockage/events.json')
        const events = JSON.parse(eventsFile)
        return events.events.find(event => event.name === eventName)
    },
    setColor() {
        const color = Math.floor(Math.random() * 0xFFFFFF);
    
        if (typeof value === 'number') {
            const modifiedColor = color + value;
            const finalColor = Math.max(0, Math.min(modifiedColor, 0xFFFFFF));
            return finalColor.toString(16).padStart(6, '0');
        }
        return Number("0x" + color.toString(16).padStart(6, '0'));
    }
}