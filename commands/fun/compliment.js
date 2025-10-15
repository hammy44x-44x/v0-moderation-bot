export default {
  name: "compliment",
  description: "Compliment a user",
  usage: "!compliment [@user]",
  cooldown: 5,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author

    const compliments = [
      "You're an awesome friend!",
      "You light up the room!",
      "You have a great sense of humor!",
      "You're more helpful than you realize!",
      "You're a gift to those around you!",
      "You're a smart cookie!",
      "You're awesome!",
      "You have impeccable manners!",
      "You're strong!",
      "Your perspective is refreshing!",
      "You're an inspiration!",
      "You're thoughtful!",
      "You have great ideas!",
      "You're a great listener!",
      "You make a difference!",
    ]

    const compliment = compliments[Math.floor(Math.random() * compliments.length)]
    await message.channel.send(`${target}, ${compliment}`)
  },
}
