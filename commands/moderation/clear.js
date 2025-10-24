import { PermissionFlagsBits, EmbedBuilder } from "discord.js"

export default {
  name: "clear",
  description: "Clear messages from the channel",
  permissions: PermissionFlagsBits.ManageMessages,
  usage: "!clear <amount> or !clear all",
  aliases: ["purge", "delete"],
  async execute(message, args) {
    if (!args[0]) {
      return message.reply("❌ Please specify the number of messages to delete or use 'all'!")
    }

    const amount = args[0].toLowerCase() === "all" ? "all" : Number.parseInt(args[0])

    if (amount !== "all" && (isNaN(amount) || amount < 1 || amount > 1000)) {
      return message.reply("❌ Please provide a valid number between 1 and 1000, or use 'all'!")
    }

    try {
      await message.delete()

      const statusMsg = await message.channel.send("🗑️ Deleting messages...")

      let deletedCount = 0

      if (amount === "all") {
        // Fetch all messages in batches
        let lastId
        let hasMore = true

        while (hasMore) {
          const options = { limit: 100 }
          if (lastId) options.before = lastId

          const messages = await message.channel.messages.fetch(options)

          if (messages.size === 0) {
            hasMore = false
            break
          }

          // Separate messages by age
          const recentMessages = messages.filter((msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000)
          const oldMessages = messages.filter((msg) => Date.now() - msg.createdTimestamp >= 14 * 24 * 60 * 60 * 1000)

          // Bulk delete recent messages
          if (recentMessages.size > 0) {
            const deleted = await message.channel.bulkDelete(recentMessages, true)
            deletedCount += deleted.size
          }

          // Individual delete for old messages
          for (const [, msg] of oldMessages) {
            try {
              await msg.delete()
              deletedCount++
              await new Promise((resolve) => setTimeout(resolve, 1000)) // Rate limit protection
            } catch (error) {
              console.log(`Could not delete message: ${error.message}`)
            }
          }

          lastId = messages.last()?.id
          await statusMsg.edit(`🗑️ Deleting messages... (${deletedCount} deleted so far)`)

          if (messages.size < 100) hasMore = false
        }
      } else {
        // Delete specific amount
        const messages = await message.channel.messages.fetch({ limit: amount })

        const recentMessages = messages.filter((msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000)
        const oldMessages = messages.filter((msg) => Date.now() - msg.createdTimestamp >= 14 * 24 * 60 * 60 * 1000)

        // Bulk delete recent messages
        if (recentMessages.size > 0) {
          const deleted = await message.channel.bulkDelete(recentMessages, true)
          deletedCount += deleted.size
        }

        // Individual delete for old messages
        for (const [, msg] of oldMessages) {
          try {
            await msg.delete()
            deletedCount++
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } catch (error) {
            console.log(`Could not delete message: ${error.message}`)
          }
        }
      }

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("🗑️ Messages Cleared")
        .addFields(
          { name: "Messages Deleted", value: `${deletedCount}`, inline: true },
          { name: "Moderator", value: `${message.author.tag}`, inline: true },
          { name: "Channel", value: `${message.channel.name}`, inline: true },
        )
        .setTimestamp()

      await statusMsg.edit({ content: null, embeds: [embed] })

      setTimeout(() => statusMsg.delete().catch(() => {}), 5000)
    } catch (error) {
      console.error("Error clearing messages:", error)
      return message.channel.send("❌ An error occurred while clearing messages!")
    }
  },
}
