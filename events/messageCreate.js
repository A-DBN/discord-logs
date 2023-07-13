const env = require('dotenv').config();
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name: 'messageCreate',
  on: true,
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.startsWith('!maso')) {
      message.delete()
      message.channel.send({files: ["./assets/maso.mp4"]})
    } else if (message.author.id === '655815335257178125' && message.content.includes('maso')) message.reply({files: ["./assets/maso.mp4"]})
    else if (message.content.toLowerCase().startsWith('!ano') && message.attachments.size > 0) {
      message.delete();
      const title = message.content.split(' ').slice(1).join(' ');
      const attachments = Array.from(message.attachments.values());

      try {
        const promises = attachments.map(async (attachment) => {
          const imageUrl = attachment.url;
          const image = await loadImage(imageUrl);

          const canvas = createCanvas(image.width, image.height);
          const cx = canvas.getContext('2d');

          cx.drawImage(image, 0, 0);

          const attachmentBuffer = canvas.toBuffer('image/png');
          return {
            name: attachment.name || 'image.png',
            attachment: attachmentBuffer,
          };
        });

        const imageAttachments = await Promise.all(promises);
        const files = imageAttachments.map((imageAttachment) => ({
          name: imageAttachment.name,
          attachment: imageAttachment.attachment,
        }));

        if (title === '') {
          message.channel.send({ files });
        } else {
          message.channel.send({ content: title, files });
        }
      } catch (error) {
        console.error(error);
        message.reply('Une erreur est survenue');
      }
    }
  },
};
