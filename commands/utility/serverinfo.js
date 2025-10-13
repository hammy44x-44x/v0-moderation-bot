import { EmbedBuilder } from "discord.js"

export default {
  name: "serverinfo",
  description: "Get information about the server",
  usage: "!serverinfo",
  aliases: ["server"],
  async execute(message) {
    const { guild } = message

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`📊 ${guild.name} Server Information`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "📅 Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        { name: "💬 Channels", value: `${guild.channels.cache.size}`, inline: true },
        { name: "😀 Emojis", value: `${guild.emojis.cache.size}`, inline: true },
        { name: "🎭 Roles", value: `${guild.roles.cache.size}`, inline: true },
      )
      .setFooter({ text: `Server ID: ${guild.id}` })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
