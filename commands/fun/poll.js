export default {
  name: "poll",
  description: "Create a poll with up to 10 options",
  usage: "!poll <question> | <option1> | <option2> | ...",
  cooldown: 10,
  async execute(message, args) {
    if (args.length === 0) {
      return message.reply(
        "Please provide a question and options! Usage: `!poll What's your favorite color? | Red | Blue | Green`",
      )
    }

    const pollData = args
      .join(" ")
      .split("|")
      .map((item) => item.trim())

    if (pollData.length < 3) {
      return message.reply(
        "Please provide at least a question and 2 options! Usage: `!poll Question? | Option 1 | Option 2`",
      )
    }

    const question = pollData[0]
    const options = pollData.slice(1)

    if (options.length > 10) {
      return message.reply("You can only have up to 10 options in a poll!")
    }

    const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

    let pollText = `📊 **${question}**\n\n`
    options.forEach((option, index) => {
      pollText += `${numberEmojis[index]} ${option}\n`
    })

    const pollMessage = await message.channel.send(pollText)

    for (let i = 0; i < options.length; i++) {
      await pollMessage.react(numberEmojis[i])
    }

    try {
      await message.delete()
    } catch (error) {
      console.log("Could not delete original message")
    }
  },
}
