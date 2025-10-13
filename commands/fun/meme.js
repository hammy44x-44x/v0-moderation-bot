export default {
  name: "meme",
  description: "Get a random meme",
  usage: "!meme",
  cooldown: 5,
  async execute(message) {
    try {
      const response = await fetch("https://meme-api.com/gimme")
      const data = await response.json()

      await message.channel.send({
        content: `**${data.title}**\n${data.url}`,
      })
    } catch (error) {
      await message.reply("❌ Could not fetch a meme right now. Try again later!")
    }
  },
}
