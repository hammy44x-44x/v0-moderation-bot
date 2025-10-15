import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "removewarn",
  description: "Remove warnings from a user",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!removewarn @user [amount|all]",
  async execute(message, args, client) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to remove warnings from!")
    }

    const userId = user.id

    if (!client.warnings.has(userId) || client.warnings.get(userId).length === 0) {
      return message.reply("❌ This user has no warnings!")
    }

    const userWarnings = client.warnings.get(userId)
    const currentWarnings = userWarnings.length
    const amountArg = args[1]?.toLowerCase()

    let removedCount = 0

    if (amountArg === "all") {
      removedCount = currentWarnings
      client.warnings.set(userId, [])
    } else {
      const amount = Number.parseInt(amountArg) || 1
      removedCount = Math.min(amount, currentWarnings)
      userWarnings.splice(-removedCount, removedCount)
    }

    const remainingWarnings = client.warnings.get(userId).length

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("✅ Warnings Removed")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Removed", value: `${removedCount}`, inline: true },
        { name: "Remaining Warnings", value: `${remainingWarnings}`, inline: true },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })

    try {
      await user.send(
        `✅ ${removedCount} warning(s) have been removed from your record in **${message.guild.name}**\n**Remaining Warnings:** ${remainingWarnings}`,
      )
    } catch (error) {
      // User has DMs disabled
    }
  },
}
