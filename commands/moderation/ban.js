import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "ban",
  description: "Ban a user from the server",
  permissions: PermissionFlagsBits.BanMembers,
  usage: "!ban @user [reason]",
  async execute(message, args) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to ban!")
    }

    const member = message.guild.members.cache.get(user.id)

    if (member && !member.bannable) {
      return message.reply("❌ I cannot ban this user! They may have higher permissions than me.")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"

    try {
      await user.send(`🔨 You have been banned from **${message.guild.name}**\n**Reason:** ${reason}`)
    } catch (error) {
      console.log("Could not send DM to user.")
    }

    await message.guild.members.ban(user, { reason })

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("🔨 User Banned")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
