import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "slowmode",
  description: "Set slowmode for the current channel",
  permissions: PermissionFlagsBits.ManageChannels,
  usage: "!slowmode <seconds> (0 to disable)",
  aliases: ["slow"],
  async execute(message, args) {
    const duration = Number.parseInt(args[0])

    if (isNaN(duration) || duration < 0) {
      return message.reply("❌ Please provide a valid duration in seconds! (0-21600)")
    }

    if (duration > 21600) {
      return message.reply("❌ Maximum slowmode duration is 21600 seconds (6 hours)!")
    }

    try {
      await message.channel.setRateLimitPerUser(duration)

      const embed = new EmbedBuilder()
        .setColor(duration === 0 ? "#00FF00" : "#FFA500")
        .setTitle(duration === 0 ? "⏱️ Slowmode Disabled" : "⏱️ Slowmode Enabled")
        .addFields(
          { name: "Channel", value: `${message.channel}`, inline: true },
          { name: "Duration", value: duration === 0 ? "Disabled" : `${duration} seconds`, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
        )
        .setTimestamp()

      await message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.error("Error setting slowmode:", error)
      return message.reply("❌ Failed to set slowmode! Make sure I have the proper permissions.")
    }
  },
}
