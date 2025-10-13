import { EmbedBuilder } from "discord.js"

export default {
  name: "leaderboard",
  description: "View the XP leaderboard",
  aliases: ["lb", "top"],
  usage: "!leaderboard",
  cooldown: 10,
  async execute(message, args, client) {
    // Convert Collection to array and sort by XP
    const sortedUsers = Array.from(client.levels.entries())
      .sort((a, b) => b[1].xp - a[1].xp)
      .slice(0, 10) // Top 10 users

    if (sortedUsers.length === 0) {
      return message.reply("📊 No users have gained XP yet!")
    }

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("🏆 XP Leaderboard")
      .setDescription("Top 10 users by XP")
      .setTimestamp()

    let description = ""
    for (let i = 0; i < sortedUsers.length; i++) {
      const [userId, userData] = sortedUsers[i]
      const user = await client.users.fetch(userId).catch(() => null)
      const username = user ? user.username : "Unknown User"
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`

      description += `${medal} **${username}** - Level ${userData.level} (${userData.xp} XP)\n`
    }

    embed.setDescription(description)

    await message.channel.send({ embeds: [embed] })
  },
}
