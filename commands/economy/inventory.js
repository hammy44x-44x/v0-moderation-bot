import { EmbedBuilder } from "discord.js"

export default {
  name: "inventory",
  description: "View your inventory",
  aliases: ["inv", "items"],
  usage: "!inventory [@user]",
  cooldown: 5,
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author
    const userId = user.id

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)

    const embed = new EmbedBuilder()
      .setColor("#e67e22")
      .setTitle(`🎒 ${user.username}'s Inventory`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()

    if (userData.inventory.length === 0) {
      embed.setDescription("This inventory is empty!")
    } else {
      const itemCounts = {}
      userData.inventory.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1
      })

      let description = ""
      for (const [itemName, count] of Object.entries(itemCounts)) {
        description += `${itemName} x${count}\n`
      }

      embed.setDescription(description)
      embed.addFields({ name: "Total Items", value: `${userData.inventory.length}`, inline: true })
    }

    await message.channel.send({ embeds: [embed] })
  },
}
