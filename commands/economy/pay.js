import { EmbedBuilder } from "discord.js"

export default {
  name: "pay",
  description: "Give money to another user",
  aliases: ["give", "transfer"],
  usage: "!pay <@user> <amount>",
  cooldown: 5,
  async execute(message, args, client) {
    const recipient = message.mentions.users.first()
    const amount = Number.parseInt(args[1])

    if (!recipient) {
      return message.reply("❌ Please mention a user to pay!")
    }

    if (recipient.id === message.author.id) {
      return message.reply("❌ You can't pay yourself!")
    }

    if (recipient.bot) {
      return message.reply("❌ You can't pay bots!")
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
      return message.reply("❌ Please specify a valid amount!")
    }

    const senderId = message.author.id
    const recipientId = recipient.id

    if (!client.economy.has(senderId)) {
      client.economy.set(senderId, { balance: 0, bank: 0, inventory: [] })
    }

    if (!client.economy.has(recipientId)) {
      client.economy.set(recipientId, { balance: 0, bank: 0, inventory: [] })
    }

    const senderData = client.economy.get(senderId)
    const recipientData = client.economy.get(recipientId)

    if (senderData.balance < amount) {
      return message.reply(`❌ You don't have enough money! You only have $${senderData.balance.toLocaleString()}.`)
    }

    senderData.balance -= amount
    recipientData.balance += amount

    client.economy.set(senderId, senderData)
    client.economy.set(recipientId, recipientData)

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("💸 Payment Successful!")
      .setDescription(`${message.author} paid **$${amount.toLocaleString()}** to ${recipient}!`)
      .addFields(
        {
          name: `${message.author.username}'s Balance`,
          value: `$${senderData.balance.toLocaleString()}`,
          inline: true,
        },
        { name: `${recipient.username}'s Balance`, value: `$${recipientData.balance.toLocaleString()}`, inline: true },
      )
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
