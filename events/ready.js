module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready to work ! Logged in as ${client.user.tag}`)
    }
}