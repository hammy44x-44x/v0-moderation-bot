import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function DeploymentOptions() {
  const platforms = [
    {
      name: "Railway",
      description: "Deploy with one click. Free tier available with $5 credit.",
      steps: [
        "Create a Railway account",
        'Click "New Project" → "Deploy from GitHub repo"',
        "Connect your GitHub and select the bot repository",
        "Add DISCORD_TOKEN environment variable",
        "Deploy and your bot will be online 24/7",
      ],
      url: "https://railway.app",
      recommended: true,
    },
    {
      name: "Render",
      description: "Free hosting for Discord bots with automatic deploys.",
      steps: [
        "Create a Render account",
        'Click "New" → "Background Worker"',
        "Connect your GitHub repository",
        "Set build command: npm install",
        "Set start command: node index.js",
        "Add DISCORD_TOKEN environment variable",
        "Deploy",
      ],
      url: "https://render.com",
    },
    {
      name: "Replit",
      description: "Quick setup with built-in code editor and hosting.",
      steps: [
        "Create a Replit account",
        "Import from GitHub or upload your code",
        "Add DISCORD_TOKEN to Secrets (lock icon)",
        'Click "Run" to start your bot',
        "Use UptimeRobot to keep it alive 24/7",
      ],
      url: "https://replit.com",
    },
    {
      name: "Heroku",
      description: "Reliable hosting with free tier (requires credit card).",
      steps: [
        "Create a Heroku account",
        "Install Heroku CLI",
        "Run: heroku create your-bot-name",
        "Run: heroku config:set DISCORD_TOKEN=your_token",
        "Run: git push heroku main",
        "Run: heroku ps:scale worker=1",
      ],
      url: "https://heroku.com",
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Deploy Your Bot 24/7</h2>
      <p className="text-muted-foreground mb-8">Choose a hosting platform to keep your bot online around the clock</p>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.name} className={platform.recommended ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{platform.name}</CardTitle>
                {platform.recommended && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Recommended</span>
                )}
              </div>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {platform.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href={platform.url} target="_blank" rel="noopener noreferrer">
                  Go to {platform.name}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Keep Your Bot Alive</CardTitle>
          <CardDescription>Some free hosting platforms may sleep after inactivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use a service like UptimeRobot to ping your bot every 5 minutes and keep it awake:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Create an UptimeRobot account</li>
            <li>Add a new monitor with your bot's URL</li>
            <li>Set monitoring interval to 5 minutes</li>
          </ol>
          <Button variant="outline" asChild>
            <a href="https://uptimerobot.com" target="_blank" rel="noopener noreferrer">
              Go to UptimeRobot
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
