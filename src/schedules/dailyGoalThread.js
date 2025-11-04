import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const channelId = process.env.DAILY_GOAL_CHANNEL_ID;

export const dailyGoalThreadJob = {
  // 매주 월, 화, 목, 금 오전 9시 40분
  schedule: "40 9 * * 1,2,4,5",
  async task(client) {
    console.log("⏰ 스레드 생성 및 목표 알림 작업을 시작합니다.");
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased() || !('threads' in channel)) {
        console.error("지정된 채널을 찾을 수 없거나 스레드를 지원하는 텍스트 채널이 아닙니다.");
        return;
      }

      const today = new Date();
      const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

      const thread = await channel.threads.create({
        name: `🔥 ${dateString} | 오늘의 목표와 진행상황을 공유해주세요!`, 
      });
      
      await thread.send({ content: `@everyone 오늘의 목표를 공유하고 함께 달려봐요! 🔥` });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);

      // DB에서 오늘 설정된 일일 목표 가져오기
      const guildId = channel.guild.id;
      const { rows: dailyGoals } = await pool.query(
        'SELECT user_id, main_goal, sub_goal_1, sub_goal_2, mood FROM daily_goals WHERE guild_id = $1 AND created_at = CURRENT_DATE',
        [guildId]
      );

      if (dailyGoals.length > 0) {
        let dailyGoalsSummary = '--- 오늘 목표를 설정한 멤버들 ---\n\n';
        for (const goal of dailyGoals) {
          dailyGoalsSummary += `<@${goal.user_id}>님의 목표:\n`;
          dailyGoalsSummary += `  1. ${goal.main_goal}\n`;
          if (goal.sub_goal_1) dailyGoalsSummary += `  2. ${goal.sub_goal_1}\n`;
          if (goal.sub_goal_2) dailyGoalsSummary += `  3. ${goal.sub_goal_2}\n`;
          dailyGoalsSummary += `  기분: ${goal.mood}\n\n`;
        }
        await thread.send(dailyGoalsSummary);
        console.log(`✅ ${dailyGoals.length}명의 일일 목표를 스레드에 게시했습니다.`);
      } else {
        await thread.send('오늘은 아직 일일 목표를 설정한 멤버가 없습니다. `/일일목표`로 목표를 설정해보세요!');
        console.log('게시할 일일 목표가 없습니다.');
      }

    } catch (error) {
      console.error("스레드 생성 및 목표 게시 중 오류가 발생했습니다:", error);
    }
  },
};
