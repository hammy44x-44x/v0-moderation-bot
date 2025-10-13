import { Shield, Zap, Bot, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SetupGuide } from "@/components/setup-guide"
import { DeploymentOptions } from "@/components/deployment-options"
import { CommandsList } from "@/components/commands-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">ModBot</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="#setup">Setup</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#deploy">Deploy</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#commands">Commands</a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">Discord Moderation Bot</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            A powerful moderation bot with automatic abuse detection, comprehensive moderation tools, and fun commands
            for your Discord server.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#setup">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Auto Moderation</CardTitle>
              <CardDescription>
                Automatically detects and handles cap abuse and spam with configurable thresholds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Powerful Commands</CardTitle>
              <CardDescription>
                Comprehensive moderation tools including warn, kick, timeout, and ban with tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bot className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fun Features</CardTitle>
              <CardDescription>
                Keep your community engaged with fun commands like 8ball, dice rolls, and jokes
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section id="setup" className="mb-20">
          <SetupGuide />
        </section>

        <section id="deploy" className="mb-20">
          <DeploymentOptions />
        </section>

        <section id="commands">
          <CommandsList />
        </section>
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Built with discord.js and Next.js</p>
        </div>
      </footer>
    </div>
  )
}
