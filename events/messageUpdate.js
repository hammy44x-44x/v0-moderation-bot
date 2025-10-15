export default {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (newMessage.author.bot) return
    if (oldMessage.content === newMessage.content) return

    const logChannelName = "logs"
    const logChannel = newMessage.guild.channels.cache.find((ch) => ch.name === logChannelName)

    if (!logChannel) return

    const embed = {
      color: 0xffa500,
      title: "✏️ Message Edited",
      fields: [
        { name: "Author", value: `${newMessage.author.tag}`, inline: true },
        { name: "Channel", value: `${newMessage.channel}`, inline: true },
        { name: "Before", value: oldMessage.content || "*No content*", inline: false },
        { name: "After", value: newMessage.content || "*No content*", inline: false },
        { name: "Jump to Message", value: `[Click here](${newMessage.url})`, inline: false },
      ],
      timestamp: new Date().toISOString(),
    }

    await logChannel.send({ embeds: [embed] }).catch(() => {})
  },
}
