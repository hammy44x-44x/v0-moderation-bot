export default {
  name: "guildBanRemove",
  async execute(ban, client) {
    const logChannelName = "logs"
    const logChannel = ban.guild.channels.cache.find((ch) => ch.name === logChannelName)

    if (!logChannel) return

    const embed = {
      color: 0x90ee90,
      title: "🔓 Member Unbanned",
      thumbnail: { url: ban.user.displayAvatarURL() },
      fields: [
        { name: "User", value: `${ban.user.tag}`, inline: true },
        { name: "ID", value: ban.user.id, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }

    await logChannel.send({ embeds: [embed] }).catch(() => {})
  },
}
