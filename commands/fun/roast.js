export default {
  name: "roast",
  description: "Roast a user",
  usage: "!roast [@user]",
  cooldown: 5,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author

    const roasts = [
      "I'd agree with you, but then we'd both be wrong.",
      "You're not stupid; you just have bad luck thinking.",
      "I'm jealous of people who don't know you.",
      "You bring everyone so much joy... when you leave the room.",
      "I'd explain it to you, but I left my crayons at home.",
      "You're like a cloud. When you disappear, it's a beautiful day.",
      "If I had a dollar for every smart thing you say, I'd be broke.",
      "You're proof that evolution can go in reverse.",
      "I'd challenge you to a battle of wits, but I see you're unarmed.",
      "You're the reason the gene pool needs a lifeguard.",
      "I'm not saying you're dumb, but you have the intellectual capacity of a potato.",
      "You're like a software update. Whenever I see you, I think 'not now'.",
    ]

    const roast = roasts[Math.floor(Math.random() * roasts.length)]
    await message.channel.send(`${target}, ${roast}`)
  },
}
