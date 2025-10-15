import { PermissionFlagsBits } from "discord.js"

export default {
  name: "unrank",
  description: "Reset a user's XP and level",
  usage: "!unrank <@user>",
  permissions: [PermissionFlagsBits.ManageMessages],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply("❌ You don't have permission to use this command!")
    }

    const target = message.mentions.users.first()
    if (!target) {
      return message.reply("❌ Please mention a user to reset their rank!")
    }

    const userId = target.id

    // Reset user's XP and level
    client.levels.set(userId, { xp: 0, level: 1, lastMessage: 0 })

    await message.reply(`✅ Successfully reset ${target.tag}'s rank to level 1 with 0 XP.`)
  },
}
