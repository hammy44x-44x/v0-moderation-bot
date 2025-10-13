import { EmbedBuilder } from "discord.js"

export default {
  name: "rank",
  description: "Check your or another user's rank and XP",
  aliases: ["level", "xp"],
  usage: "!rank [@user]",
  cooldown: 5,
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author
    const userId = user.id

    if (!client.levels.has(userId)) {
      client.levels.set(userId, { xp: 0, level: 1, lastMessage: 0 })
    }

    const userData = client.levels.get(userId)
    const xpForNextLevel = userData.level * 100
    const xpProgress = userData.xp - (userData.level - 1) * 100

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(`📊 ${user.username}'s Rank`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Level", value: `${userData.level}`, inline: true },
        { name: "Total XP", value: `${userData.xp}`, inline: true },
        { name: "Progress", value: `${xpProgress}/${xpForNextLevel} XP to next level`, inline: false },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
