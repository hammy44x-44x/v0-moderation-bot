export default {
  name: "ping",
  description: "Check the bot latency",
  usage: "!ping",
  async execute(message) {
    const sent = await message.reply("🏓 Pinging...")
    const latency = sent.createdTimestamp - message.createdTimestamp
    const apiLatency = Math.round(message.client.ws.ping)

    await sent.edit(`🏓 Pong!\n**Latency:** ${latency}ms\n**API Latency:** ${apiLatency}ms`)
  },
}
