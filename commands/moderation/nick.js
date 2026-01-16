module.exports = {
  name: "nick",
  description: "Change a user's nickname",
  usage: "!nick <@user> <new nickname | reset>",
  aliases: ["nickname", "setnick"],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageNicknames")) {
      return message.reply("You need `Manage Nicknames` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("ManageNicknames")) {
      return message.reply("I need `Manage Nicknames` permission to change nicknames.")
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!target) {
      return message.reply("Please mention a user or provide their ID.")
    }

    if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("I cannot change the nickname of this user. They have equal or higher role than me.")
    }

    const newNick = args.slice(1).join(" ")
    if (!newNick) {
      return message.reply("Please provide a new nickname or 'reset' to remove it.")
    }

    try {
      const oldNick = target.nickname || target.user.username

      if (newNick.toLowerCase() === "reset") {
        await target.setNickname(null)
        const embed = {
          color: 0x339af0,
          title: "Nickname Reset",
          fields: [
            { name: "User", value: `${target.user.tag}`, inline: true },
            { name: "Old Nickname", value: oldNick, inline: true },
            { name: "Moderator", value: `${message.author.tag}`, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }
        return message.channel.send({ embeds: [embed] })
      }

      if (newNick.length > 32) {
        return message.reply("Nickname must be 32 characters or less.")
      }

      await target.setNickname(newNick)

      const embed = {
        color: 0x339af0,
        title: "Nickname Changed",
        fields: [
          { name: "User", value: `${target.user.tag}`, inline: true },
          { name: "Old Nickname", value: oldNick, inline: true },
          { name: "New Nickname", value: newNick, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
        ],
        timestamp: new Date().toISOString(),
      }

      return message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
      return message.reply("Failed to change the nickname.")
    }
  },
}
