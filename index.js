import { Client, GatewayIntentBits, Collection, PermissionFlagsBits } from "discord.js"
import { config } from "dotenv"
import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
})

// Collections for commands and cooldowns
client.commands = new Collection()
client.cooldowns = new Collection()

// User message tracking for spam detection
client.messageTracker = new Collection()

// Warning system
client.warnings = new Collection()

// Load commands
const commandsPath = join(__dirname, "commands")
const commandFolders = readdirSync(commandsPath)

for (const folder of commandFolders) {
  const folderPath = join(commandsPath, folder)
  const commandFiles = readdirSync(folderPath).filter((file) => file.endsWith(".js"))

  for (const file of commandFiles) {
    const filePath = join(folderPath, file)
    const command = await import(`file://${filePath}`)

    if ("name" in command.default && "execute" in command.default) {
      client.commands.set(command.default.name, command.default)
    }
  }
}

client.once("ready", () => {
  console.log(`✅ Bot is online as ${client.user.tag}`)
  client.user.setActivity("!help for commands", { type: "WATCHING" })
})

client.on("messageCreate", async (message) => {
  // Ignore bot messages
  if (message.author.bot) return

  const now = Date.now()
  const userId = message.author.id

  // Check for cap abuse
  if (message.content.length > 10) {
    const capsCount = (message.content.match(/[A-Z]/g) || []).length
    const capsPercentage = (capsCount / message.content.length) * 100

    if (capsPercentage > 70) {
      try {
        await message.delete()
        await message.channel.send(`${message.author}, please don't abuse caps lock! 🚫`)
      } catch (error) {
        console.error("Error handling cap abuse:", error)
      }
      return
    }
  }

  // Spam detection
  if (!client.messageTracker.has(userId)) {
    client.messageTracker.set(userId, [])
  }

  const userMessages = client.messageTracker.get(userId)
  userMessages.push(now)

  // Remove messages older than 5 seconds
  const recentMessages = userMessages.filter((timestamp) => now - timestamp < 5000)
  client.messageTracker.set(userId, recentMessages)

  // If more than 5 messages in 5 seconds, it's spam
  if (recentMessages.length > 5) {
    try {
      await message.delete()
      const member = message.guild.members.cache.get(userId)

      if (member && !member.permissions.has(PermissionFlagsBits.Administrator)) {
        await member.timeout(60000, "Spam detected")
        await message.channel.send(`${message.author} has been timed out for 1 minute due to spam! 🚫`)
        client.messageTracker.delete(userId)
      }
    } catch (error) {
      console.error("Error handling spam:", error)
    }
    return
  }

  // Command handling
  if (!message.content.startsWith("!")) return

  const args = message.content.slice(1).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command =
    client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  // Check permissions
  if (command.permissions) {
    const member = message.guild.members.cache.get(message.author.id)
    if (!member.permissions.has(command.permissions)) {
      return message.reply("❌ You do not have permission to use this command!")
    }
  }

  // Cooldown handling
  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection())
  }

  const timestamps = client.cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(
        `⏰ Please wait ${timeLeft.toFixed(1)} more seconds before using \`!${command.name}\` again.`,
      )
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  // Execute command
  try {
    await command.execute(message, args, client)
  } catch (error) {
    console.error(`Error executing command ${command.name}:`, error)
    message.reply("❌ There was an error executing that command!")
  }
})

client.login(process.env.DISCORD_TOKEN)
