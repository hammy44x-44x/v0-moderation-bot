const ALLOWED_USERS = [
  "YOUR_USER_ID_HERE", // Replace with your Discord user ID
  // Add more user IDs here as needed
]

export default {
  name: "say",
  description: "Make the bot say something (restricted command)",
  usage: "!say <message>",
  cooldown: 3,
  async execute(message, args) {
    if (!ALLOWED_USERS.includes(message.author.id)) {
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
