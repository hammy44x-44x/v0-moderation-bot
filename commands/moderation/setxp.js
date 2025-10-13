import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "setxp",
  description: "Set a user's XP",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!setxp @user <amount>",
  async execute(message, args, client) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user!")
    }

    const amount = Number.parseInt(args[1])

    if (isNaN(amount) || amount < 0) {
      return message.reply("❌ Please provide a valid XP amount (0 or higher)!")
    }

    const userId = user.id

    // Initialize or update user data
    if (!client.levels.has(userId)) {
      client.levels.set(userId, { xp: 0, level: 1, lastMessage: 0 })
    }

    const userData = client.levels.get(userId)
    userData.xp = amount
    userData.level = Math.floor(amount / 100) + 1
    client.levels.set(userId, userData)

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("✅ XP Updated")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "New XP", value: `${amount}`, inline: true },
        { name: "New Level", value: `${userData.level}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}` },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
