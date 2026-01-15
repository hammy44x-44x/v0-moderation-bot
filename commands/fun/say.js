import fs from "fs"
import path from "path"

export default {
  name: "say",
  description: "Make the bot say something (restricted command)",
  usage: "!say <message>",
  cooldown: 3,
  async execute(message, args) {
    const permissionsPath = path.join(process.cwd(), "config", "permissions.json")
    let allowedUsers = []

    try {
      const data = fs.readFileSync(permissionsPath, "utf8")
      const permissions = JSON.parse(data)
      allowedUsers = permissions.allowedSayUsers || []
    } catch (error) {
      console.log("Could not load permissions:", error.message)
    }

    if (!allowedUsers.includes(message.author.id)) {
      return message.reply("❌ You don't have permission to use this command!")
    }

    if (!args.length) {
      return message.reply("❌ Please provide a message for me to say!")
    }

    const text = args.join(" ")

    // Delete the user's command message
    try {
      await message.delete()
    } catch (error) {
      console.log("Could not delete message:", error.message)
    }

    // Send the message as the bot
    await message.channel.send(text)
  },
}
