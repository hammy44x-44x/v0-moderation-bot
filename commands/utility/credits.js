import { EmbedBuilder } from "discord.js"

export default {
  name: "credits",
  description: "View bot credits and information",
  usage: "!credits",
  aliases: ["about", "info", "botinfo"],
  cooldown: 5,
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("🤖 Bot Credits & Information")
      .setDescription("A powerful moderation and utility bot for Discord servers")
      .addFields(
        { name: "👨‍💻 Developer", value: "Created with ❤️ by the community", inline: true },
        { name: "📦 Version", value: "1.0.0", inline: true },
        { name: "⚡ Prefix", value: "`!`", inline: true },
        {
          name: "✨ Features",
          value:
            "• Advanced Moderation System\n• XP & Leveling System\n• Economy System\n• Auto-Moderation (Spam, Caps, Bad Words)\n• Fun Commands\n• Utility Commands",
          inline: false,
        },
        {
          name: "🔗 Links",
          value: "[Support Server](https://discord.gg/example) • [Invite Bot](https://discord.com/oauth2/authorize)",
          inline: false,
        },
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
