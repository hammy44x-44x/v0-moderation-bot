export default {
  name: "roll",
  description: "Roll a dice",
  usage: "!roll [sides]",
  cooldown: 2,
  async execute(message, args) {
    const sides = Number.parseInt(args[0]) || 6

    if (sides < 2 || sides > 100) {
      return message.reply("❌ Please provide a number between 2 and 100!")
    }

    const result = Math.floor(Math.random() * sides) + 1
    await message.reply(`🎲 You rolled a **${result}** out of ${sides}!`)
  },
}
