import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, ActivityType } from "discord.js"
import { config } from "dotenv"
import { readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

config()

// Validate environment
console.log("🔍 Checking environment variables...")
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ ERROR: DISCORD_TOKEN is not set in .env file!")
  console.error("Please create a .env file with your bot token:")
  console.error("DISCORD_TOKEN=your_token_here")
  process.exit(1)
}

const tokenPreview = process.env.DISCORD_TOKEN.substring(0, 30) + "..."
console.log("✅ Token loaded:", tokenPreview)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
})

// Initialize collections
client.commands = new Collection()
client.cooldowns = new Collection()
client.messageTracker = new Collection()
client.warnings = new Collection()
client.levels = new Collection()
client.processedMessages = new Set()
client.levelUpCooldown = new Set()
client.economy = new Collection()
client.afkUsers = new Map()

let blockedWordsConfig = { blockedWords: [], blockedPatterns: [] }
try {
  const configPath = join(__dirname, "config", "blocked-words.json")
  blockedWordsConfig = JSON.parse(readFileSync(configPath, "utf-8"))
  console.log(
    `🛡️ Loaded ${blockedWordsConfig.blockedWords.length} blocked words and ${blockedWordsConfig.blockedPatterns.length} patterns`,
  )
} catch (error) {
  console.warn("⚠️ Could not load blocked words config, word filter disabled")
}

// Load commands
const commandsPath = join(__dirname, "commands")
const commandFolders = readdirSync(commandsPath)

console.log("📂 Loading commands...")
for (const folder of commandFolders) {
  const folderPath = join(commandsPath, folder)
  const commandFiles = readdirSync(folderPath).filter((file) => file.endsWith(".js"))

  for (const file of commandFiles) {
    const filePath = join(folderPath, file)
    const command = await import(`file://${filePath}`)

    if ("name" in command.default && "execute" in command.default) {
      client.commands.set(command.default.name, command.default)
      console.log(`  ✓ Loaded: ${command.default.name}`)
    }
  }
}

// Ready event
client.once("ready", () => {
  console.log(`\n✅ Bot is online as ${client.user.tag}`)
  console.log(`🎮 Serving ${client.guilds.cache.size} server(s)`)
  console.log(`👥 Watching ${client.users.cache.size} user(s)`)
  console.log(`📝 Loaded ${client.commands.size} commands\n`)

  client.user.setPresence({
    activities: [{ name: "!help for commands", type: ActivityType.Watching }],
    status: "online",
  })
})

// Message handler
client.on("messageCreate", async (message) => {
  // Ignore bots
  if (message.author.bot) return

  const now = Date.now()
  const userId = message.author.id

  const member = message.guild.members.cache.get(userId)
  const isStaffMember =
    member &&
    (member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      member.permissions.has(PermissionFlagsBits.Administrator) ||
      member.permissions.has(PermissionFlagsBits.ManageMessages) ||
      member.permissions.has(PermissionFlagsBits.KickMembers) ||
      member.permissions.has(PermissionFlagsBits.BanMembers))

  const startsWithPrefix = message.content.startsWith("!") // Declare startsWithPrefix variable

  if (client.processedMessages.has(message.id)) {
    return
  }
  client.processedMessages.add(message.id)
  setTimeout(() => client.processedMessages.delete(message.id), 10000)

  if (client.afkUsers.has(userId)) {
    const afkData = client.afkUsers.get(userId)
    client.afkUsers.delete(userId)

    const afkDuration = Math.floor((now - afkData.timestamp) / 1000)
    const minutes = Math.floor(afkDuration / 60)
    const seconds = afkDuration % 60

    let timeString = ""
    if (minutes > 0) {
      timeString = `${minutes}m ${seconds}s`
    } else {
      timeString = `${seconds}s`
    }

    await message
      .reply(`👋 Welcome back! You were AFK for **${timeString}**`)
      .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000))
      .catch(() => {})
  }

  if (message.mentions.users.size > 0) {
    for (const [mentionedUserId, mentionedUser] of message.mentions.users) {
      if (client.afkUsers.has(mentionedUserId)) {
        const afkData = client.afkUsers.get(mentionedUserId)
        const afkDuration = Math.floor((now - afkData.timestamp) / 1000)
        const minutes = Math.floor(afkDuration / 60)

        let timeString = ""
        if (minutes > 0) {
          timeString = `${minutes} minute(s) ago`
        } else {
          timeString = "just now"
        }

        await message
          .reply(`💤 ${mentionedUser.tag} is currently AFK: **${afkData.reason}** (${timeString})`)
          .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 10000))
          .catch(() => {})
        break
      }
    }
  }

  if (isStaffMember && startsWithPrefix && message.content.length > 1) {
    const logChannel = message.guild.channels.cache.find((ch) => ch.name === "admin-logs" || ch.name === "mod-logs")

    if (logChannel) {
      const { EmbedBuilder } = await import("discord.js")
      const logEmbed = new EmbedBuilder()
        .setColor("#FFA500")
        .setTitle("🔧 Staff Command Used")
        .setDescription(`**${message.author.tag}** used a command`)
        .addFields(
          { name: "User", value: `${message.author} (${message.author.id})`, inline: true },
          { name: "Channel", value: `${message.channel}`, inline: true },
          { name: "Command", value: `\`${message.content}\``, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `User ID: ${message.author.id}` })

      await logChannel.send({ embeds: [logEmbed] }).catch(() => {})
    }
  }

  if (blockedWordsConfig.blockedWords.length > 0 || blockedWordsConfig.blockedPatterns.length > 0) {
    const messageContent = message.content.toLowerCase()
    let containsBlockedWord = true
    let matchedWord = ""

    // Check against blocked words list
    for (const word of blockedWordsConfig.blockedWords) {
      const cleanWord = word.replace(/\*/g, "").toLowerCase()
      if (messageContent.includes(cleanWord)) {
        containsBlockedWord = true
        matchedWord = word
        break
      }
    }

    // Check against regex patterns
    if (!containsBlockedWord) {
      for (const pattern of blockedWordsConfig.blockedPatterns) {
        try {
          const regex = new RegExp(pattern, "i")
          if (regex.test(messageContent)) {
            containsBlockedWord = true
            matchedWord = "inappropriate content"
            break
          }
        } catch (error) {
          console.error("Invalid regex pattern:", pattern)
        }
      }
    }

    if (containsBlockedWord) {
      await message.delete().catch(() => {})

      if (!client.warnings.has(userId)) {
        client.warnings.set(userId, [])
      }

      const userWarnings = client.warnings.get(userId)
      userWarnings.push({
        moderator: "AutoMod",
        reason: "Use of prohibited language",
        timestamp: Date.now(),
      })

      await message.channel
        .send(
          `${message.author}, your message was removed for containing prohibited language! You have been warned. (Warning ${userWarnings.length}) 🚫`,
        )
        .catch(() => {})

      try {
        await message.author.send(
          `⚠️ You have been warned in **${message.guild.name}**\n**Reason:** Use of prohibited language\n**Total Warnings:** ${userWarnings.length}\n\n💡 Please keep the server appropriate and respectful.`,
        )
      } catch (error) {
        // User has DMs disabled
      }

      return
    }
  }

  // XP System - runs for all messages
  if (!client.levels.has(userId)) {
    client.levels.set(userId, { xp: 0, level: 1, lastMessage: 0 })
  }

  const userData = client.levels.get(userId)

  // Award XP (once per minute)
  if (now - userData.lastMessage > 60000) {
    const xpGain = Math.floor(Math.random() * 11) + 15
    userData.xp += xpGain
    userData.lastMessage = now

    const newLevel = Math.floor(userData.xp / 100) + 1

    if (newLevel > userData.level) {
      const levelUpKey = `${userId}-${newLevel}`

      if (!client.levelUpCooldown.has(levelUpKey)) {
        userData.level = newLevel
        client.levelUpCooldown.add(levelUpKey)

        message.reply(`🎉 You leveled up to level **${newLevel}**!`).catch(() => {})

        // Remove from cooldown after 5 seconds
        setTimeout(() => client.levelUpCooldown.delete(levelUpKey), 5000)
      }
    }

    client.levels.set(userId, userData)
  }

  // Staff ping protection system
  const staffRoleNames = ["admin", "administrator", "mod", "moderator", "staff", "owner", "helper", "support"]

  // Skip check if user is staff themselves
  const isStaff =
    member &&
    (member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      member.permissions.has(PermissionFlagsBits.Administrator))

  if (!isStaff && message.mentions.roles.size > 0) {
    // Check if any mentioned role is a staff role
    const mentionedStaffRole = message.mentions.roles.find((role) => {
      const roleName = role.name.toLowerCase()
      return staffRoleNames.some((staffName) => roleName.includes(staffName))
    })

    if (mentionedStaffRole) {
      await message.delete().catch(() => {})

      if (!client.warnings.has(userId)) {
        client.warnings.set(userId, [])
      }

      const userWarnings = client.warnings.get(userId)
      userWarnings.push({
        moderator: "AutoMod",
        reason: "Unauthorized staff ping",
        timestamp: Date.now(),
      })

      await message.channel
        .send(
          `${message.author}, you have been warned for pinging staff unnecessarily! (Warning ${userWarnings.length}) 🚫`,
        )
        .catch(() => {})

      // Try to DM the user
      try {
        await message.author.send(
          `⚠️ You have been warned in **${message.guild.name}**\n**Reason:** Unauthorized staff ping\n**Total Warnings:** ${userWarnings.length}\n\n💡 Please use proper channels to contact staff or wait for them to respond.`,
        )
      } catch (error) {
        // User has DMs disabled
      }

      return
    }
  }

  // Cap abuse detection
  if (message.content.length > 10) {
    const capsCount = (message.content.match(/[A-Z]/g) || []).length
    const capsPercentage = (capsCount / message.content.length) * 100

    if (capsPercentage > 70) {
      await message.delete().catch(() => {})

      if (!client.warnings.has(userId)) {
        client.warnings.set(userId, [])
      }

      const userWarnings = client.warnings.get(userId)
      userWarnings.push({
        moderator: "AutoMod",
        reason: "Cap abuse (excessive caps lock)",
        timestamp: Date.now(),
      })

      await message.channel
        .send(`${message.author}, you have been warned for cap abuse! (Warning ${userWarnings.length}) 🚫`)
        .catch(() => {})

      // Try to DM the user
      try {
        await message.author.send(
          `⚠️ You have been warned in **${message.guild.name}**\n**Reason:** Cap abuse (excessive caps lock)\n**Total Warnings:** ${userWarnings.length}`,
        )
      } catch (error) {
        // User has DMs disabled
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

  const recentMessages = userMessages.filter((timestamp) => now - timestamp < 5000)
  client.messageTracker.set(userId, recentMessages)

  if (recentMessages.length > 5) {
    await message.delete().catch(() => {})

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!client.warnings.has(userId)) {
        client.warnings.set(userId, [])
      }

      const userWarnings = client.warnings.get(userId)
      userWarnings.push({
        moderator: "AutoMod",
        reason: "Spam (5+ messages in 5 seconds)",
        timestamp: Date.now(),
      })

      await member.timeout(60000, "Spam detected").catch(() => {})
      await message.channel
        .send(
          `${message.author} has been timed out for 1 minute due to spam! You have been warned. (Warning ${userWarnings.length}) 🚫`,
        )
        .catch(() => {})

      // Try to DM the user
      try {
        await message.author.send(
          `⚠️ You have been warned in **${message.guild.name}**\n**Reason:** Spam (5+ messages in 5 seconds)\n**Total Warnings:** ${userWarnings.length}`,
        )
      } catch (error) {
        // User has DMs disabled
      }

      client.messageTracker.delete(userId)
    }
    return
  }

  // Command handling
  if (!startsWithPrefix) return

  const args = message.content.slice(1).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command =
    client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  // Permission check
  if (command.permissions) {
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
    console.error(`Error executing ${command.name}:`, error)
    message.reply("❌ There was an error executing that command!").catch(() => {})
  }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const member = interaction.guild.members.cache.get(interaction.user.id)
  const isStaffMember =
    member &&
    (member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      member.permissions.has(PermissionFlagsBits.Administrator) ||
      member.permissions.has(PermissionFlagsBits.ManageMessages) ||
      member.permissions.has(PermissionFlagsBits.KickMembers) ||
      member.permissions.has(PermissionFlagsBits.BanMembers))

  if (isStaffMember) {
    const logChannel = interaction.guild.channels.cache.find((ch) => ch.name === "admin-logs" || ch.name === "mod-logs")

    if (logChannel) {
      const { EmbedBuilder } = await import("discord.js")
      const commandString = `/${interaction.commandName} ${interaction.options.data.map((opt) => `${opt.name}:${opt.value}`).join(" ")}`

      const logEmbed = new EmbedBuilder()
        .setColor("#FFA500")
        .setTitle("🔧 Staff Slash Command Used")
        .setDescription(`**${interaction.user.tag}** used a slash command`)
        .addFields(
          { name: "User", value: `${interaction.user} (${interaction.user.id})`, inline: true },
          { name: "Channel", value: `${interaction.channel}`, inline: true },
          { name: "Command", value: `\`${commandString}\``, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `User ID: ${interaction.user.id}` })

      await logChannel.send({ embeds: [logEmbed] }).catch(() => {})
    }
  }
})

// Login
console.log("🔐 Attempting to login to Discord...")
client
  .login(process.env.DISCORD_TOKEN.trim())
  .then(() => console.log("✅ Login successful!"))
  .catch((error) => {
    console.error("\n❌ Failed to login to Discord!")
    console.error("Error:", error.message)
    console.error("\n🔧 Troubleshooting:")
    console.error("1. Go to https://discord.com/developers/applications")
    console.error("2. Select your bot → Bot section")
    console.error("3. Click 'Reset Token' and copy the new token")
    console.error("4. Replace token in .env file")
    console.error("5. Enable: Server Members Intent & Message Content Intent")
    process.exit(1)
  })
