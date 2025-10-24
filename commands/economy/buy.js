import { EmbedBuilder } from "discord.js"
import { readFileSync } from "fs"
import { join } from "path"

export default {
  name: "buy",
  description: "Buy an item from the shop",
  aliases: ["purchase"],
  usage: "!buy <item_id>",
  cooldown: 3,
  async execute(message, args, client) {
    const userId = message.author.id

    if (!args[0]) {
      return message.reply("❌ Please specify an item ID! Use `!shop` to see available items.")
    }

    const itemId = args[0].toLowerCase()
    const shopData = JSON.parse(readFileSync(join(process.cwd(), "config", "shop.json"), "utf-8"))
    const item = shopData.items.find((i) => i.id === itemId)

    if (!item) {
      return message.reply("❌ That item doesn't exist! Use `!shop` to see available items.")
    }

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)

    if (userData.balance < item.price) {
      return message.reply(
        `❌ You don't have enough money! You need $${item.price.toLocaleString()} but only have $${userData.balance.toLocaleString()}.`,
      )
    }

    userData.balance -= item.price
    userData.inventory.push({ id: item.id, name: item.name, purchasedAt: Date.now() })
    client.economy.set(userId, userData)

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("✅ Purchase Successful!")
      .setDescription(`You bought **${item.name}** for **$${item.price.toLocaleString()}**!`)
      .addFields({ name: "💰 Remaining Balance", value: `$${userData.balance.toLocaleString()}`, inline: true })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
