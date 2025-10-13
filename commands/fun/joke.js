export default {
  name: "joke",
  description: "Get a random joke",
  usage: "!joke",
  cooldown: 5,
  async execute(message) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "Why don't eggs tell jokes? They'd crack each other up!",
      "What do you call a fake noodle? An impasta!",
      "Why did the bicycle fall over? Because it was two tired!",
      "What do you call a bear with no teeth? A gummy bear!",
      "Why couldn't the bicycle stand up by itself? It was two tired!",
      "What did the ocean say to the beach? Nothing, it just waved!",
      "Why do seagulls fly over the sea? Because if they flew over the bay, they'd be bagels!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
    ]

    const joke = jokes[Math.floor(Math.random() * jokes.length)]
    await message.reply(`😄 ${joke}`)
  },
}
