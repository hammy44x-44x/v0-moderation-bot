module.exports = {
  name: "unlock",
  description: "Unlock a channel to allow members to send messages",
  usage: "!unlock [reason]",
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply("You need `Manage Channels` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("ManageChannels")) {
      return message.reply("I need `Manage Channels` permission to unlock channels.")
    }

    const reason = args.join(" ") || "No reason provided"
    const channel = message.channel

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: null,
      })

      const embed = {
        color: 0x51cf66,
        title: "🔓 Channel Unlocked",
        description: `This channel has been unlocked.`,
        fields: [
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
          { name: "Reason", value: reason, inline: true },
        ],
        timestamp: new Date().toISOString(),
      }

      return message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      return message.reply("Failed to unlock the channel.")
    }
  },
}
