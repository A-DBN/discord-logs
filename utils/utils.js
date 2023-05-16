const fs = require('fs')

module.exports = {
    getObject(eventName) {
        const eventsFile = fs.readFileSync('Stockage/events.json')
        const events = JSON.parse(eventsFile)
        return events.events.find(event => event.name === eventName)
    }
}