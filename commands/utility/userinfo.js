import { EmbedBuilder } from "discord.js"

export default {
  name: "userinfo",
  description: "Get information about a user",
  usage: "!userinfo [@user]",
  aliases: ["user", "whois"],
  async execute(message) {
    const user = message.mentions.users.first() || message.author
    const member = message.guild.members.cache.get(user.id)

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "🆔 User ID", value: user.id, inline: true },
        { name: "📅 Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        {
          name: "📥 Joined Server",
          value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "N/A",
          inline: true,
        },
        {
          name: "🎭 Roles",
          value: member
            ? member.roles.cache
                .map((role) => role.name)
                .slice(0, 10)
                .join(", ")
            : "N/A",
        },
      )
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
