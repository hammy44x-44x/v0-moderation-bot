export default {
  name: "reverse",
  description: "Reverse text",
  usage: "!reverse <text>",
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) {
      return message.reply("❌ Please provide text to reverse!")
    }

    const text = args.join(" ")
    const reversed = text.split("").reverse().join("")

    await message.reply(`🔄 ${reversed}`)
  },
}
