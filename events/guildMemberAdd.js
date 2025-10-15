export default {
  name: "guildMemberAdd",
  async execute(member, client) {
    const logChannelName = "logs"
    const logChannel = member.guild.channels.cache.find((ch) => ch.name === logChannelName)

    if (!logChannel) return

    const embed = {
      color: 0x00ff00,
      title: "📥 Member Joined",
      thumbnail: { url: member.user.displayAvatarURL() },
      fields: [
        { name: "User", value: `${member.user.tag}`, inline: true },
        { name: "ID", value: member.user.id, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Member Count", value: `${member.guild.memberCount}`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }

    await logChannel.send({ embeds: [embed] }).catch(() => {})
  },
}
