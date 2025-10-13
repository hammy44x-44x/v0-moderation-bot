import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CommandsList() {
  const commandCategories = [
    {
      name: "Moderation",
      description: "Commands for managing your server",
      commands: [
        { name: "!warn", description: "Warn a user for breaking rules", usage: "!warn @user [reason]" },
        { name: "!kick", description: "Kick a user from the server", usage: "!kick @user [reason]" },
        { name: "!timeout", description: "Timeout a user for a duration", usage: "!timeout @user [duration] [reason]" },
        { name: "!ban", description: "Ban a user from the server", usage: "!ban @user [reason]" },
        { name: "!warnings", description: "Check warnings for a user", usage: "!warnings @user" },
      ],
    },
    {
      name: "Auto Moderation",
      description: "Automatic abuse detection and handling",
      commands: [
        {
          name: "Cap Abuse",
          description: "Automatically deletes messages with >70% capital letters",
          usage: "Automatic",
        },
        { name: "Spam Detection", description: "Timeouts users sending 5+ messages in 5 seconds", usage: "Automatic" },
      ],
    },
    {
      name: "Fun",
      description: "Entertainment commands for your community",
      commands: [
        { name: "!8ball", description: "Ask the magic 8ball a question", usage: "!8ball [question]" },
        { name: "!roll", description: "Roll dice", usage: "!roll [sides]" },
        { name: "!coinflip", description: "Flip a coin", usage: "!coinflip" },
        { name: "!joke", description: "Get a random joke", usage: "!joke" },
        { name: "!meme", description: "Get a random meme", usage: "!meme" },
      ],
    },
    {
      name: "Utility",
      description: "Helpful utility commands",
      commands: [
        { name: "!help", description: "Show all available commands", usage: "!help [command]" },
        { name: "!ping", description: "Check bot latency", usage: "!ping" },
        { name: "!serverinfo", description: "Display server information", usage: "!serverinfo" },
        { name: "!userinfo", description: "Display user information", usage: "!userinfo [@user]" },
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Commands</h2>
      <p className="text-muted-foreground mb-8">
        All commands use the prefix <Badge variant="secondary">!</Badge>
      </p>

      <div className="grid gap-6">
        {commandCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.commands.map((command) => (
                  <div key={command.name} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono text-foreground">{command.name}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{command.description}</p>
                    <p className="text-xs text-muted-foreground font-mono">Usage: {command.usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
