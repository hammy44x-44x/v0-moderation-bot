module.exports = {
  name: "purge",
  description: "Delete messages from a specific user",
  usage: "!purge <@user> <amount>",
  aliases: ["prune"],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("You need `Manage Messages` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("ManageMessages")) {
      return message.reply("I need `Manage Messages` permission to delete messages.")
    }

    const target = message.mentions.users.first()
    if (!target) {
      return message.reply("Please mention a user whose messages you want to delete.")
    }

    const amount = Number.parseInt(args[1])
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Please provide a number between 1 and 100.")
    }

    try {
      await message.delete().catch(() => {})

      const messages = await message.channel.messages.fetch({ limit: 100 })
      const userMessages = messages.filter((m) => m.author.id === target.id).first(amount)

      if (userMessages.length === 0) {
        return message.channel.send("No messages found from that user in the last 100 messages.")
      }

      const deleted = await message.channel.bulkDelete(userMessages, true)

      const embed = {
        color: 0x339af0,
        title: "Messages Purged",
        fields: [
          { name: "Target", value: `${target.tag}`, inline: true },
          { name: "Deleted", value: `${deleted.size} messages`, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
        ],
        timestamp: new Date().toISOString(),
      }

      const reply = await message.channel.send({ embeds: [embed] })
      setTimeout(() => reply.delete().catch(() => {}), 5000)
    } catch (error) {
      console.error(error)
      return message.reply("Failed to purge messages. Messages older than 14 days cannot be bulk deleted.")
    }
  },
}
