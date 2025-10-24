import { EmbedBuilder } from "discord.js"

export default {
  name: "balance",
  description: "Check your or another user's balance",
  aliases: ["bal", "money", "cash"],
  usage: "!balance [@user]",
  cooldown: 3,
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author
    const userId = user.id

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle(`💰 ${user.username}'s Balance`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "💵 Wallet", value: `$${userData.balance.toLocaleString()}`, inline: true },
        { name: "🏦 Bank", value: `$${userData.bank.toLocaleString()}`, inline: true },
        { name: "💎 Net Worth", value: `$${(userData.balance + userData.bank).toLocaleString()}`, inline: false },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
