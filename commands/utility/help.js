import { EmbedBuilder } from "discord.js"

export default {
  name: "help",
  description: "List all commands or info about a specific command",
  usage: "!help [command]",
  aliases: ["commands"],
  async execute(message, args, client) {
    const { commands } = client

    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("📚 Bot Commands")
        .setDescription("Here are all available commands:")
        .addFields(
          {
            name: "🛡️ Moderation",
            value: "`!warn` `!kick` `!timeout` `!ban` `!warnings`",
          },
          {
            name: "🎮 Fun",
            value: "`!8ball` `!roll` `!coinflip` `!joke` `!meme`",
          },
          {
            name: "⚙️ Utility",
            value: "`!help` `!ping` `!serverinfo` `!userinfo`",
          },
        )
        .setFooter({ text: "Use !help <command> for more info on a command" })
        .setTimestamp()

      return message.channel.send({ embeds: [embed] })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply("❌ That is not a valid command!")
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Command: ${command.name}`)
      .setDescription(command.description || "No description available")
      .addFields({ name: "Usage", value: command.usage || "No usage information" })

    if (command.aliases) {
      embed.addFields({ name: "Aliases", value: command.aliases.join(", ") })
    }

    if (command.cooldown) {
      embed.addFields({ name: "Cooldown", value: `${command.cooldown} seconds` })
    }

    await message.channel.send({ embeds: [embed] })
  },
}
