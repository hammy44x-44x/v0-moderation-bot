import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "removetimeout",
  description: "Remove timeout from a user",
  permissions: PermissionFlagsBits.ModerateMembers,
  usage: "!removetimeout @user [reason]",
  aliases: ["untimeout", "unmute"],
  async execute(message, args) {
    const user = message.mentions.users.first()

    if (!user) {
      return message.reply("❌ Please mention a user to remove timeout from!")
    }

    const member = message.guild.members.cache.get(user.id)

    if (!member) {
      return message.reply("❌ That user is not in this server!")
    }

    if (!member.isCommunicationDisabled()) {
      return message.reply("❌ This user is not timed out!")
    }

    if (!member.moderatable) {
      return message.reply("❌ I cannot modify this user! They may have higher permissions than me.")
    }

    const reason = args.slice(1).join(" ") || "No reason provided"

    try {
      await user.send(`✅ Your timeout has been removed in **${message.guild.name}**\n**Reason:** ${reason}`)
    } catch (error) {
      console.log("Could not send DM to user.")
    }

    await member.timeout(null, reason)

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("✅ Timeout Removed")
      .addFields(
        { name: "User", value: `${user.tag}`, inline: true },
        { name: "Moderator", value: `${message.author.tag}`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
