import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "timeout",
  description: "Timeout a user",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!timeout @user <duration_in_minutes> [reason]",
  aliases: ["mute"],
  async execute(message, args) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to timeout!")
    }

    const member = message.guild.members.cache.get(user.id)

    if (!member) {
      return message.reply("❌ That user is not in this server!")
    }

    if (!member.moderatable) {
      return message.reply("❌ I cannot timeout this user! They may have higher permissions than me.")
    }

    const duration = Number.parseInt(args[1])

    if (!duration || duration < 1) {
      return message.reply("❌ Please provide a valid duration in minutes! (1-40320)")
    }

    if (duration > 40320) {
      return message.reply("❌ Maximum timeout duration is 40320 minutes (28 days)!")
    }

    const reason = args.slice(2).join(" ") || "No reason provided"
    const durationMs = duration * 60 * 1000

    try {
      await user.send(
        `⏰ You have been timed out in **${message.guild.name}** for **${duration} minutes**\n**Reason:** ${reason}`,
      )
    } catch (error) {
      console.log("Could not send DM to user.")
    }

    await member.timeout(durationMs, reason)

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setTitle("⏰ User Timed Out")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Duration", value: `${duration} minutes`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
