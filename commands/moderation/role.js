module.exports = {
  name: "role",
  description: "Add or remove a role from a user",
  usage: "!role <@user> <@role | role name>",
  aliases: ["giverole", "takerole"],
  cooldown: 5,
  async execute(message, args, client) {
    if (!message.member.permissions.has("ManageRoles")) {
      return message.reply("You need `Manage Roles` permission to use this command.")
    }

    if (!message.guild.members.me.permissions.has("ManageRoles")) {
      return message.reply("I need `Manage Roles` permission to manage roles.")
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!target) {
      return message.reply("Please mention a user or provide their ID.")
    }

    const roleArg = args.slice(1).join(" ")
    if (!roleArg) {
      return message.reply("Please mention a role or provide a role name.")
    }

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find((r) => r.name.toLowerCase() === roleArg.toLowerCase()) ||
      message.guild.roles.cache.get(roleArg)

    if (!role) {
      return message.reply("Could not find that role. Please mention it or provide the exact name.")
    }

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply("I cannot manage this role. It's equal or higher than my highest role.")
    }

    if (role.position >= message.member.roles.highest.position) {
      return message.reply("You cannot manage this role. It's equal or higher than your highest role.")
    }

    try {
      if (target.roles.cache.has(role.id)) {
        await target.roles.remove(role)
        const embed = {
          color: 0xff6b6b,
          title: "Role Removed",
          fields: [
            { name: "User", value: `${target.user.tag}`, inline: true },
            { name: "Role", value: `${role.name}`, inline: true },
            { name: "Moderator", value: `${message.author.tag}`, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }
        return message.channel.send({ embeds: [embed] })
      } else {
        await target.roles.add(role)
        const embed = {
          color: 0x51cf66,
          title: "Role Added",
          fields: [
            { name: "User", value: `${target.user.tag}`, inline: true },
            { name: "Role", value: `${role.name}`, inline: true },
            { name: "Moderator", value: `${message.author.tag}`, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }
        return message.channel.send({ embeds: [embed] })
      }
    } catch (error) {
      console.error(error)
      return message.reply("Failed to manage the role.")
    }
  },
}
