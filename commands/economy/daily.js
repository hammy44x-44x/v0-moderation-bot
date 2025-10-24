import { EmbedBuilder } from "discord.js"

export default {
  name: "daily",
  description: "Claim your daily reward",
  aliases: ["dailyreward"],
  usage: "!daily",
  cooldown: 86400, // 24 hours
  async execute(message, args, client) {
    const userId = message.author.id

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)
    const reward = Math.floor(Math.random() * 500) + 500 // 500-1000

    userData.balance += reward
    client.economy.set(userId, userData)

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle("🎁 Daily Reward Claimed!")
      .setDescription(`You received **$${reward.toLocaleString()}**!`)
      .addFields({ name: "💰 New Balance", value: `$${userData.balance.toLocaleString()}`, inline: true })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
