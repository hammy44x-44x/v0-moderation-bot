module.exports = {
  name: "unban",
  description: "Unban a user from the server",
  usage: "!unban <user ID> [reason]",
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("You need `Ban Members` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("BanMembers")) {
      return message.reply("I need `Ban Members` permission to unban users.")
    }

    const userId = args[0]
    if (!userId) {
      return message.reply("Please provide the user ID to unban.")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"

    try {
      const banList = await message.guild.bans.fetch()
      const bannedUser = banList.find((ban) => ban.user.id === userId)

      if (!bannedUser) {
        return message.reply("This user is not banned or the ID is invalid.")
      }

      await message.guild.members.unban(userId, `Unbanned by ${message.author.tag}: ${reason}`)

      const embed = {
        color: 0x51cf66,
        title: "User Unbanned",
        fields: [
          { name: "User", value: `${bannedUser.user.tag} (${userId})`, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
          { name: "Reason", value: reason },
        ],
        timestamp: new Date().toISOString(),
      }

      return message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      return message.reply("Failed to unban the user. Make sure the ID is correct.")
    }
  },
}
