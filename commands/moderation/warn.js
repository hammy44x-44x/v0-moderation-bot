import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "warn",
  description: "Warn a user",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!warn @user [reason]",
  async execute(message, args, client) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to warn!")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"
    const userId = user.id

    // Initialize warnings for user if not exists
    if (!client.warnings.has(userId)) {
      client.warnings.set(userId, [])
    }

    const userWarnings = client.warnings.get(userId)
    userWarnings.push({
      moderator: message.author.tag,
      reason: reason,
      timestamp: Date.now(),
    })

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("⚠️ User Warned")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
        { name: "Total Warnings", value: `${userWarnings.length}`, inline: true },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })

    // Try to DM the user
    try {
      await user.send(
        `⚠️ You have been warned in **${message.guild.name}**\n**Reason:** ${reason}\n**Total Warnings:** ${userWarnings.length}`,
      )
    } catch (error) {
      message.channel.send("⚠️ Could not send DM to user.")
    }
  },
}
