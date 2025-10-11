// src/commands/ping.js
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setNameLocalizations({ ko: "핑" })
    .setDescription("Checks if the bot is alive")
    .setDescriptionLocalizations({
      ko: "봇이 살아있는지 확인합니다",
    }),
  async execute(interaction) {
    await interaction.reply({ content: "🏓 Pong!", ephemeral: true });
  },
};
