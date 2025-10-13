export default {
  name: "riz",
  description: "Get a random pickup line",
  usage: "!riz",
  cooldown: 5,
  async execute(message) {
    const pickupLines = [
      "Are you a magician? Because whenever I look at you, everyone else disappears.",
      "Do you have a map? I keep getting lost in your eyes.",
      "Are you a parking ticket? Because you've got FINE written all over you.",
      "Is your name Google? Because you have everything I've been searching for.",
      "Do you believe in love at first sight, or should I walk by again?",
      "Are you a camera? Because every time I look at you, I smile.",
      "If you were a vegetable, you'd be a cute-cumber.",
      "Are you made of copper and tellurium? Because you're Cu-Te.",
      "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
      "Is your dad a boxer? Because you're a knockout!",
      "Are you a time traveler? Because I see you in my future.",
      "Do you have a sunburn, or are you always this hot?",
      "Are you a loan? Because you've got my interest.",
      "If beauty were time, you'd be an eternity.",
      "Are you a Wi-Fi signal? Because I'm feeling a connection.",
    ]

    const line = pickupLines[Math.floor(Math.random() * pickupLines.length)]
    await message.reply(`💫 ${line}`)
  },
}
