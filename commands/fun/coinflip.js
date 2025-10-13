export default {
  name: "coinflip",
  description: "Flip a coin",
  usage: "!coinflip",
  aliases: ["flip", "coin"],
  cooldown: 2,
  async execute(message) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails"
    await message.reply(`🪙 The coin landed on **${result}**!`)
  },
}
