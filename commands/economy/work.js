import { EmbedBuilder } from "discord.js"

const jobs = [
  { name: "programmer", min: 100, max: 300 },
  { name: "chef", min: 80, max: 250 },
  { name: "teacher", min: 70, max: 200 },
  { name: "delivery driver", min: 60, max: 180 },
  { name: "cashier", min: 50, max: 150 },
  { name: "janitor", min: 40, max: 120 },
]

export default {
  name: "work",
  description: "Work to earn money",
  aliases: ["job"],
  usage: "!work",
  cooldown: 3600, // 1 hour
  async execute(message, args, client) {
    const userId = message.author.id

    if (!client.economy.has(userId)) {
      client.economy.set(userId, { balance: 0, bank: 0, inventory: [] })
    }

    const userData = client.economy.get(userId)
    const job = jobs[Math.floor(Math.random() * jobs.length)]
    const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min

    userData.balance += earnings
    client.economy.set(userId, userData)

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("💼 Work Complete!")
      .setDescription(`You worked as a **${job.name}** and earned **$${earnings.toLocaleString()}**!`)
      .addFields({ name: "💰 New Balance", value: `$${userData.balance.toLocaleString()}`, inline: true })
      .setTimestamp()

    await message.channel.send({ embeds: [embed] })
  },
}
