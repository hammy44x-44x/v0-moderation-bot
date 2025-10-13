import { EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  name: "warnings",
  description: "Check warnings for a user",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!warnings @user",
  aliases: ["warns"],
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author
    const userId = user.id

    const userWarnings = client.warnings.get(userId) || []

    if (userWarnings.length === 0) {
      return message.reply(`✅ ${user.tag} has no warnings!`)
    }

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle(`⚠️ Warnings for ${user.tag}`)
      .setDescription(`Total Warnings: **${userWarnings.length}**`)
      .setTimestamp()

    userWarnings.forEach((warning, index) => {
      const date = new Date(warning.timestamp).toLocaleString()
      embed.addFields({
        name: `Warning #${index + 1}`,
        value: `**Moderator:** ${warning.moderator}\n**Reason:** ${warning.reason}\n**Date:** ${date}`,
      })
    })

    await message.channel.send({ embeds: [embed] })
  },
}
