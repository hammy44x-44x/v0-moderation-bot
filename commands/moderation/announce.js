module.exports = {
  name: "announce",
  description: "Send an announcement to a channel",
  usage: "!announce <#channel> <message>",
  aliases: ["announcement"],
  cooldown: 10,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("You need `Manage Messages` permission to use this command.")
    }

    const channel = message.mentions.channels.first()
    if (!channel) {
      return message.reply("Please mention a channel to send the announcement to.")
    }

    const announcement = args.slice(1).join(" ")
    if (!announcement) {
      return message.reply("Please provide an announcement message.")
    }

    try {
      await message.delete().catch(() => {})

      const embed = {
        color: 0x5865f2,
        title: "📢 Announcement",
        description: announcement,
        footer: {
          text: `Announced by ${message.author.tag}`,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        },
        timestamp: new Date().toISOString(),
      }

      await channel.send({ embeds: [embed] })

      const confirmEmbed = {
        color: 0x51cf66,
        description: `Announcement sent to ${channel}!`,
      }

      const reply = await message.channel.send({ embeds: [confirmEmbed] })
      setTimeout(() => reply.delete().catch(() => {}), 5000)
    } catch (error) {
      console.error(error)
      return message.reply("Failed to send the announcement.")
    }
  },
}
