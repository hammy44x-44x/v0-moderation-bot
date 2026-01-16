module.exports = {
  name: "lock",
  description: "Lock a channel to prevent members from sending messages",
  usage: "!lock [reason]",
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply("You need `Manage Channels` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("ManageChannels")) {
      return message.reply("I need `Manage Channels` permission to lock channels.")
    }

    const reason = args.join(" ") || "No reason provided"
    const channel = message.channel

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      })

      const embed = {
        color: 0xff6b6b,
        title: "🔒 Channel Locked",
        description: `This channel has been locked by a moderator.`,
        fields: [
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
          { name: "Reason", value: reason, inline: true },
        ],
        timestamp: new Date().toISOString(),
      }

      return message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      return message.reply("Failed to lock the channel.")
    }
  },
}
