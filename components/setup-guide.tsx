"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ExternalLink } from "lucide-react"

export function SetupGuide() {
  const [clientId, setClientId] = useState("")
  const [copied, setCopied] = useState(false)

  const inviteUrl = clientId
    ? `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=1099511627830&scope=bot`
    : ""

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-6">Setup Guide</h2>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Discord Application</CardTitle>
            <CardDescription>Create a new application in the Discord Developer Portal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Go to the Discord Developer Portal</li>
              <li>Click "New Application" and give it a name</li>
              <li>Navigate to the "Bot" section in the left sidebar</li>
              <li>Click "Add Bot" and confirm</li>
              <li>
                Under "Privileged Gateway Intents", enable:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Server Members Intent</li>
                  <li>Message Content Intent</li>
                </ul>
              </li>
            </ol>
            <Button asChild>
              <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer">
                Open Developer Portal
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Get Your Bot Token</CardTitle>
            <CardDescription>Copy your bot token for deployment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>In the "Bot" section, find the "Token" area</li>
              <li>Click "Reset Token" (or "Copy" if you haven't reset it)</li>
              <li>Copy the token and save it securely</li>
              <li className="text-destructive font-semibold">Never share your token publicly!</li>
            </ol>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm text-muted-foreground">DISCORD_TOKEN=your_token_here</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Invite Bot to Your Server</CardTitle>
            <CardDescription>Generate an invite link with the correct permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-id">Application Client ID</Label>
              <Input
                id="client-id"
                placeholder="Enter your application's client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Find this in the "General Information" section of your application
              </p>
            </div>

            {inviteUrl && (
              <div className="space-y-2">
                <Label>Invite URL</Label>
                <div className="flex gap-2">
                  <Input value={inviteUrl} readOnly />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(inviteUrl)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button asChild className="w-full">
                  <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                    Open Invite Link
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
