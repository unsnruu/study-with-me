import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const channelId = process.env.WEEKLY_ACHIEVEMENT_CHANNEL_ID;

export const weeklyAchievementThreadJob = {
  // 매주 금요일 오전 10시
  schedule: "00 10 * * 5",
  async task(client) {
    console.log("⏰ 주간 스레드 생성 작업을 시작합니다.");
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error("지정된 채널을 찾을 수 없거나 텍스트 채널이 아닙니다.");
        return;
      }

      const today = new Date();
      const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

      const thread = await channel.threads.create({
        name: `📅 ${dateString} | 한 주간의 성과를 공유해주세요!`,
      });
      await thread.send({
        content: `@everyone 한주의 성과를 공유하는 마무리. 미리 Figma 링크를 공유해주세요 :)`,
      });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);

      // DB에서 이번 주 설정된 주간 목표 가져오기
      const guildId = channel.guild.id;
      const { rows: weeklyGoals } = await pool.query(
        "SELECT user_id, goal FROM weekly_goals WHERE guild_id = $1",
        [guildId]
      );

      if (weeklyGoals.length > 0) {
        let weeklyGoalsSummary = "🔽**이번 주 목표를 설정한 멤버들**🔽\n\n";
        for (const goal of weeklyGoals) {
          weeklyGoalsSummary += `<@${goal.user_id}>님의 목표: ${goal.goal}\n`;
        }
        await thread.send(weeklyGoalsSummary);
        console.log(
          `✅ ${weeklyGoals.length}명의 주간 목표를 스레드에 게시했습니다.`
        );
      } else {
        await thread.send("이번 주 주간 목표를 설정한 멤버가 없습니다.");
        console.log("게시할 주간 목표가 없습니다.");
      }
    } catch (error) {
      console.error("스레드 생성 중 오류가 발생했습니다:", error);
    }
  },
};
