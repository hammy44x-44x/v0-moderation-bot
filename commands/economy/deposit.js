import { EmbedBuilder } from "discord.js"

export default {
  name: "deposit",
  description: "Deposit money into your bank",
  aliases: ["dep"],
  usage: "!deposit <amount|all>",
  cooldown: 3,
  async execute(message, args, client) {
    const userId = message.author.id

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)

    if (!args[0]) {
      return message.reply("❌ Please specify an amount to deposit!")
    }

    let amount
    if (args[0].toLowerCase() === "all") {
      amount = userData.balance
    } else {
      amount = Number.parseInt(args[0])
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
      return message.reply("❌ Please specify a valid amount!")
    }

    if (userData.balance < amount) {
      return message.reply(
        `❌ You don't have enough money in your wallet! You only have $${userData.balance.toLocaleString()}.`,
      )
    }

    userData.balance -= amount
    userData.bank += amount
    client.economy.set(userId, userData)

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("🏦 Deposit Successful!")
      .setDescription(`You deposited **$${amount.toLocaleString()}** into your bank!`)
      .addFields(
        { name: "💵 Wallet", value: `$${userData.balance.toLocaleString()}`, inline: true },
        { name: "🏦 Bank", value: `$${userData.bank.toLocaleString()}`, inline: true },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
