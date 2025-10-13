# Discord Moderation Bot

A feature-rich Discord moderation bot with abuse detection, moderation commands, and fun features!

## Features

### 🛡️ Moderation Commands
- `!warn @user [reason]` - Warn a user
- `!kick @user [reason]` - Kick a user from the server
- `!timeout @user <minutes> [reason]` - Timeout a user
- `!ban @user [reason]` - Ban a user from the server
- `!warnings @user` - Check warnings for a user

### 🚫 Automatic Abuse Detection
- **Cap Abuse Detection** - Automatically deletes messages with excessive caps (>70%)
- **Spam Detection** - Automatically times out users sending more than 5 messages in 5 seconds

### 🎮 Fun Commands
- `!8ball <question>` - Ask the magic 8ball a question
- `!roll [sides]` - Roll a dice (default 6 sides)
- `!coinflip` - Flip a coin
- `!joke` - Get a random joke
- `!meme` - Get a random meme

### ⚙️ Utility Commands
- `!help [command]` - List all commands or get info about a specific command
- `!ping` - Check bot latency
- `!serverinfo` - Get server information
- `!userinfo [@user]` - Get user information

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- A Discord Bot Token

### Installation

1. **Clone or download this project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create a Discord Bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to the "Bot" section and click "Add Bot"
   - Under "Privileged Gateway Intents", enable:
     - Server Members Intent
     - Message Content Intent
   - Copy your bot token

4. **Configure the bot**
   - Copy `.env.example` to `.env`
   - Add your bot token to the `.env` file:
     \`\`\`
     DISCORD_TOKEN=your_bot_token_here
     CLIENT_ID=your_client_id_here
     GUILD_ID=your_guild_id_here
     \`\`\`

5. **Invite the bot to your server**
   - Go to OAuth2 > URL Generator in the Discord Developer Portal
   - Select scopes: `bot`
   - Select permissions:
     - Kick Members
     - Ban Members
     - Timeout Members
     - Manage Messages
     - Read Messages/View Channels
     - Send Messages
     - Embed Links
     - Read Message History
   - Copy the generated URL and open it in your browser
   - Select your server and authorize

6. **Start the bot**
   \`\`\`bash
   npm start
   \`\`\`

   For development with auto-reload:
   \`\`\`bash
   npm run dev
   \`\`\`

## Bot Permissions Required

Make sure your bot has these permissions in your Discord server:
- Kick Members
- Ban Members
- Moderate Members (for timeout)
- Manage Messages (for deleting spam/cap abuse)
- Send Messages
- Embed Links
- Read Message History

## Command Cooldowns

Most commands have cooldowns to prevent spam:
- Moderation commands: 3 seconds
- Fun commands: 2-5 seconds
- Utility commands: No cooldown

## Notes

- The bot automatically detects and handles cap abuse (>70% caps in messages longer than 10 characters)
- Spam detection triggers after 5 messages in 5 seconds
- Warnings are stored in memory and will reset when the bot restarts
- All moderation actions are logged with embeds
- The bot attempts to DM users when they are warned, kicked, timed out, or banned

## Support

If you encounter any issues, make sure:
1. Your bot has the correct permissions
2. The bot token is correct in the `.env` file
3. All required intents are enabled in the Discord Developer Portal
4. Node.js version is 18 or higher

Enjoy your moderation bot! 🎉
