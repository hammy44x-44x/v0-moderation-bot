export default {
  name: "choose",
  description: "Choose between multiple options",
  usage: "!choose <option1> | <option2> | ...",
  aliases: ["pick"],
  cooldown: 3,
  async execute(message, args) {
    if (args.length === 0) {
      return message.reply("❌ Please provide options separated by |. Example: `!choose pizza | burger | tacos`")
    }

    const options = args
      .join(" ")
      .split("|")
      .map((option) => option.trim())
      .filter((option) => option.length > 0)

    if (options.length < 2) {
      return message.reply("❌ Please provide at least 2 options!")
    }

    const choice = options[Math.floor(Math.random() * options.length)]
    await message.reply(`🤔 I choose: **${choice}**`)
  },
}
