const env = require ('dotenv').config()
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'messageCreate',
    on: true,
    async execute(message) {
        if (message.content.toLowerCase().startsWith("!ano") && message.attachments.size > 0) {
            message.delete()
            const title = message.content.split(' ').slice(1).join(' ')
            const attachment = message.attachments.first()
            const imageUrl = attachment.url

            try {
                const image = await loadImage(imageUrl);
                const canvas = createCanvas(image.width, image.height);
                const cx = canvas.getContext('2d');

                cx.drawImage(image, 0, 0)

                const attachmentBuffer = canvas.toBuffer('image/png')
                title === "" ? message.channel.send({ files: [attachmentBuffer] }) : message.channel.send({content: title, files: [attachmentBuffer]});
            } catch (error) {
                console.error(error)
                message.reply("Une erreur est survenue")
            }
        }
    }
}