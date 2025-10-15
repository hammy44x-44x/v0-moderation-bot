import { EmbedBuilder } from "discord.js"

export default {
  name: "avatar",
  description: "Display a user's avatar",
  usage: "!avatar [@user]",
  aliases: ["av", "pfp"],
  cooldown: 3,
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
