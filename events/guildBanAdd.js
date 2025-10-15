export default {
  name: "guildBanAdd",
  async execute(ban, client) {
    const logChannelName = "logs"
    const logChannel = ban.guild.channels.cache.find((ch) => ch.name === logChannelName)

    if (!logChannel) return

    const embed = {
      color: 0x8b0000,
      title: "🔨 Member Banned",
      thumbnail: { url: ban.user.displayAvatarURL() },
      fields: [
        { name: "User", value: `${ban.user.tag}`, inline: true },
        { name: "ID", value: ban.user.id, inline: true },
        { name: "Reason", value: ban.reason || "No reason provided", inline: false },
      ],
      timestamp: new Date().toISOString(),
    }

    await logChannel.send({ embeds: [embed] }).catch(() => {})
  },
}
