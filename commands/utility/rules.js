export default {
  name: "rules",
  description: "Display server rules and policies",
  aliases: ["rule", "policy", "policies"],
  cooldown: 5,
  execute(message) {
    const rulesEmbed = {
      color: 0xff0000,
      title: "📜 Server Rules & Policies",
      description: "Please follow these rules to keep our community safe and friendly!",
      fields: [
        {
          name: "1️⃣ Be Respectful",
          value: "Treat everyone with respect. No harassment, hate speech, or discrimination.",
          inline: false,
        },
        {
          name: "2️⃣ No Spam",
          value: "Avoid spamming messages, emojis, or mentions. Keep chat clean and readable.",
          inline: false,
        },
        {
          name: "3️⃣ No NSFW Content",
          value: "Keep all content appropriate for all ages. NSFW content will result in immediate action.",
          inline: false,
        },
        {
          name: "4️⃣ No Advertising",
          value: "Do not advertise other servers, products, or services without permission.",
          inline: false,
        },
        {
          name: "5️⃣ Use Appropriate Channels",
          value: "Post content in the correct channels. Keep discussions on-topic.",
          inline: false,
        },
        {
          name: "6️⃣ No Staff Ping Abuse",
          value: "Only ping staff members when absolutely necessary. Use proper channels for support.",
          inline: false,
        },
        {
          name: "7️⃣ Follow Discord ToS",
          value: "All Discord Terms of Service and Community Guidelines apply here.",
          inline: false,
        },
        {
          name: "⚠️ Consequences",
          value: "Breaking rules may result in warnings, timeouts, kicks, or bans depending on severity.",
          inline: false,
        },
      ],
      footer: {
        text: "Thank you for being part of our community!",
      },
      timestamp: new Date().toISOString(),
    }

    return message.channel.send({ embeds: [rulesEmbed] })
  },
}
