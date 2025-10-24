import { EmbedBuilder } from "discord.js"
import { readFileSync } from "fs"
import { join } from "path"

export default {
  name: "shop",
  description: "View items available for purchase",
  aliases: ["store"],
  usage: "!shop",
  cooldown: 5,
  async execute(message, args, client) {
    const shopData = JSON.parse(readFileSync(join(process.cwd(), "config", "shop.json"), "utf-8"))

    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("🛒 Shop")
      .setDescription("Use `!buy <item>` to purchase an item")
      .setTimestamp()

    shopData.items.forEach((item) => {
      embed.addFields({
        name: `${item.name} - $${item.price.toLocaleString()}`,
        value: `${item.description}\nID: \`${item.id}\``,
        inline: false,
      })
    })

    await message.channel.send({ embeds: [embed] })
  },
}
