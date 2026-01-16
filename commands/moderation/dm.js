const ALLOWED_USERS = [
  "YOUR_USER_ID_HERE",
  // Add more user IDs here
]

export default {
  name: "dm",
  description: "Send a direct message to a user as the bot",
  usage: "!dm <@user> <message>",
  cooldown: 10,
  async execute(message, args, client) {
    if (!ALLOWED_USERS.includes(message.author.id)) {
      return message.reply("You don't have permission to use this command.")
    }

    const target = message.mentions.users.first() || (await client.users.fetch(args[0]).catch(() => null))
    if (!target) {
      return message.reply("Please mention a user or provide their ID.")
    }

    const dmMessage = args.slice(1).join(" ")
    if (!dmMessage) {
      return message.reply("Please provide a message to send.")
    }

    try {
      await message.delete().catch(() => {})

      const embed = {
        color: 0x5865f2,
        title: `📬 Message from ${message.guild.name}`,
        description: dmMessage,
        footer: {
          text: `Sent by a server moderator`,
          icon_url: message.guild.iconURL({ dynamic: true }),
        },
        timestamp: new Date().toISOString(),
      }

      await target.send({ embeds: [embed] })

      const confirmEmbed = {
        color: 0x51cf66,
        description: `✅ DM sent to ${target.tag}!`,
      }

      const reply = await message.channel.send({ embeds: [confirmEmbed] })
      setTimeout(() => reply.delete().catch(() => {}), 5000)
    } catch (error) {
      console.error(error)
      return message.reply("Failed to send DM. The user may have DMs disabled.")
    }
  },
}
