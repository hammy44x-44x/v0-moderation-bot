export default {
  name: "say",
  description: "Make the bot say something",
  usage: "!say <message>",
  cooldown: 3,
  async execute(message, args) {
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
