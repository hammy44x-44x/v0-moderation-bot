export default {
  name: "messageDelete",
  async execute(message, client) {
    if (message.author.bot) return

    const logChannelName = "logs"
    const logChannel = message.guild.channels.cache.find((ch) => ch.name === logChannelName)

    if (!logChannel) return

    const embed = {
      color: 0xff6b6b,
      title: "🗑️ Message Deleted",
      fields: [
        { name: "Author", value: `${message.author.tag}`, inline: true },
        { name: "Channel", value: `${message.channel}`, inline: true },
        { name: "Content", value: message.content || "*No content*", inline: false },
      ],
      timestamp: new Date().toISOString(),
    }

    await logChannel.send({ embeds: [embed] }).catch(() => {})
  },
}
