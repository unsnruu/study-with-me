import { SlashCommandBuilder } from "discord.js";
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
  data: new SlashCommandBuilder()
    .setName("dailygoal")
    .setNameLocalizations({ ko: "일일목표" })
    .setDescription("Set your daily goal!")
    .setDescriptionLocalizations({ ko: "오늘의 목표를 설정합니다." })
    .addStringOption((option) =>
      option
        .setName("main-goal")
        .setNameLocalizations({ ko: "주요목표" })
        .setDescription("Your main goal for today.")
        .setDescriptionLocalizations({ ko: "오늘의 주요 목표입니다." })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mood")
        .setNameLocalizations({ ko: "기분" })
        .setDescription("How you are feeling today.")
        .setDescriptionLocalizations({ ko: "오늘의 기분입니다." })
        .setRequired(true)
        .addChoices(
          {
            name: "🔥 열정적으로 달릴 준비 완료!",
            value: "🔥 열정적으로 달릴 준비 완료!",
          },
          {
            name: "☕ 차분하고 집중 잘 될 것 같은 날",
            value: "☕ 차분하고 집중 잘 될 것 같은 날",
          },
          { name: "😊 그냥 좋은 날", value: "😊 그냥 좋은 날" },
          {
            name: "🫠 조금 지쳤지만 힘내볼게요",
            value: "🫠 조금 지쳤지만 힘내볼게요",
          }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.user;
    const mainGoal = interaction.options.getString("main-goal");
    const mood = interaction.options.getString("mood");
    
    let weeklyGoal = '';
    try {
      const { rows } = await pool.query('SELECT goal FROM weekly_goals WHERE user_id = $1 AND guild_id = $2', [user.id, interaction.guild.id]);
      if (rows.length > 0) {
        weeklyGoal = rows[0].goal;
      }
    } catch (error) {
      console.error('Error fetching weekly goal:', error);
      // Continue without weekly goal if db query fails
    }

    const weeklyGoalText = weeklyGoal ? `\n\n**📅 주간 목표: ${weeklyGoal}**` : '';

    const replyContent = `
**✨${user.username}님의 오늘의 목표✨**${weeklyGoalText}

**🎯 주요 목표: ${mainGoal}**

💭 **오늘의 기분:** ${mood}
        `;

    await interaction.editReply({ content: replyContent, ephemeral: false });
  },
};
