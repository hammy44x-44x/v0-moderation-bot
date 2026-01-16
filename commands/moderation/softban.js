module.exports = {
  name: "softban",
  description: "Ban and immediately unban a user to delete their messages",
  usage: "!softban <@user> [reason]",
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("You need `Ban Members` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("BanMembers")) {
      return message.reply("I need `Ban Members` permission to softban users.")
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!target) {
      return message.reply("Please mention a user or provide their ID to softban.")
    }

    if (target.id === message.author.id) {
      return message.reply("You cannot softban yourself.")
    }

    if (target.roles.highest.position >= message.member.roles.highest.position) {
      return message.reply("You cannot softban someone with equal or higher role than you.")
    }

    if (!target.bannable) {
      return message.reply("I cannot softban this user. They may have higher permissions than me.")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"

    try {
      await target
        .send({
          embeds: [
            {
              color: 0xffa500,
              title: "You have been softbanned",
              description: `You were softbanned from **${message.guild.name}**`,
              fields: [
                { name: "Reason", value: reason },
                { name: "Note", value: "You can rejoin the server, but your recent messages were deleted." },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        })
        .catch(() => {})

      await message.guild.members.ban(target, {
        deleteMessageDays: 7,
        reason: `Softban by ${message.author.tag}: ${reason}`,
      })
      await message.guild.members.unban(target.id, `Softban by ${message.author.tag}`)

      const embed = {
        color: 0xffa500,
        title: "User Softbanned",
        fields: [
          { name: "User", value: `${target.user.tag} (${target.id})`, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
          { name: "Reason", value: reason },
        ],
        timestamp: new Date().toISOString(),
      }

      return message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      return message.reply("Failed to softban the user.")
    }
  },
}
