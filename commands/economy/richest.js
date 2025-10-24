import { EmbedBuilder } from "discord.js"

export default {
  name: "richest",
  description: "View the richest users",
  aliases: ["baltop", "moneyleaderboard"],
  usage: "!richest",
  cooldown: 10,
  async execute(message, args, client) {
    const economyData = Array.from(client.economy.entries())
      .map(([userId, data]) => ({
        userId,
        netWorth: data.balance + data.bank,
      }))
      .sort((a, b) => b.netWorth - a.netWorth)
      .slice(0, 10)

    if (economyData.length === 0) {
      return message.reply("❌ No economy data available yet!")
    }

    const embed = new EmbedBuilder().setColor("#f1c40f").setTitle("💎 Richest Users").setTimestamp()

    let description = ""
    for (let i = 0; i < economyData.length; i++) {
      const user = await client.users.fetch(economyData[i].userId).catch(() => null)
      const username = user ? user.username : "Unknown User"
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`
      description += `${medal} **${username}** - $${economyData[i].netWorth.toLocaleString()}\n`
    }

    embed.setDescription(description)

    await message.channel.send({ embeds: [embed] })
  },
}
