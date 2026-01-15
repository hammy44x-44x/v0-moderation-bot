import { EmbedBuilder } from "discord.js"

export default {
  name: "afk",
  description: "Set your AFK status",
  usage: "!afk [reason]",
  aliases: ["away"],
  cooldown: 5,
  async execute(message, args, client) {
    if (!client.afkUsers) {
      client.afkUsers = new Map()
    }

    const reason = args.join(" ") || "AFK"

    client.afkUsers.set(message.author.id, {
      reason: reason,
      timestamp: Date.now(),
    })

    const embed = new EmbedBuilder()
      .setColor("#FFA500")
      .setDescription(`💤 ${message.author}, you are now AFK: **${reason}**`)
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  },
}
