import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setNameLocalizations({ ko: "출석체크" })
    .setDescription("Checks you in for the day.")
    .setDescriptionLocalizations({ ko: "출석체크를 합니다." }),
  async execute(interaction) {
    const user = interaction.user;
    await interaction.reply(`<@${user.id}>님이 출석체크를 하였습니다.`);
  },
};
