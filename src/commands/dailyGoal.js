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
    )
    .addStringOption((option) =>
      option
        .setName("goal1")
        .setNameLocalizations({ ko: "목표1" })
        .setDescription("Your first goal for today.")
        .setDescriptionLocalizations({ ko: "오늘의 첫 번째 목표입니다." })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("goal2")
        .setNameLocalizations({ ko: "목표2" })
        .setDescription("Your second goal for today (optional).")
        .setDescriptionLocalizations({ ko: "오늘의 두 번째 목표입니다. (선택 사항)" })
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("goal3")
        .setNameLocalizations({ ko: "목표3" })
        .setDescription("Your third goal for today (optional).")
        .setDescriptionLocalizations({ ko: "오늘의 세 번째 목표입니다. (선택 사항)" })
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const user = interaction.user;
    const goal1 = interaction.options.getString("goal1");
    const goal2 = interaction.options.getString("goal2");
    const goal3 = interaction.options.getString("goal3");
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

    try {
      const query = `
        INSERT INTO daily_goals (user_id, guild_id, goal1, goal2, goal3, mood)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, guild_id, created_at) DO UPDATE
        SET goal1 = $3, goal2 = $4, goal3 = $5, mood = $6;
      `;
      await pool.query(query, [user.id, interaction.guild.id, goal1, goal2, goal3, mood]);
    } catch (error) {
      console.error('Error saving daily goal:', error);
      // Continue with reply even if saving fails
    }

    const weeklyGoalText = weeklyGoal ? `\n\n**📅 주간 목표: ${weeklyGoal}**` : '';

    let dailyGoalsText = `**1. ${goal1}**`;
    if (goal2) {
      dailyGoalsText += `\n**2. ${goal2}**`;
    }
    if (goal3) {
      dailyGoalsText += `\n**3. ${goal3}**`;
    }

    const replyContent = `
**✨${user.username}님의 오늘의 목표✨**${weeklyGoalText}

${dailyGoalsText}

💭 **오늘의 기분:** ${mood}
        `;

    await interaction.editReply({ content: replyContent, ephemeral: false });
  },
};
