import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "kick",
  description: "Kick a user from the server",
  permissions: PermissionFlagsBits.KickMembers,
  usage: "!kick @user [reason]",
  async execute(message, args) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to kick!")
    }

    const member = message.guild.members.cache.get(user.id)

    if (!member) {
      return message.reply("❌ That user is not in this server!")
    }

    if (!member.kickable) {
      return message.reply("❌ I cannot kick this user! They may have higher permissions than me.")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"

    try {
      await user.send(`👢 You have been kicked from **${message.guild.name}**\n**Reason:** ${reason}`)
    } catch (error) {
      console.log("Could not send DM to user.")
    }

    await member.kick(reason)

    const embed = new EmbedBuilder()
      .setColor("#FF6B6B")
      .setTitle("👢 User Kicked")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
