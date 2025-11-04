import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const channelId = process.env.DAILY_GOAL_CHANNEL_ID;

export const dailyGoalThreadJob = {
  // 매 30초마다 (테스트용)
  schedule: "*/30 * * * * *",
  async task(client) {
    console.log("⏰ 스레드 생성 및 목표 알림 작업을 시작합니다.");
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased() || !('threads' in channel)) {
        console.error("지정된 채널을 찾을 수 없거나 스레드를 지원하는 텍스트 채널이 아닙니다.");
        return;
      }

      const today = new Date();
      const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일 ${today.getHours()}:${today.getMinutes()}`;

      const thread = await channel.threads.create({
        name: `🔥 ${dateString} | 오늘의 목표와 진행상황을 공유해주세요!`,
      });
      
      await thread.send({ content: `@everyone 오늘의 목표를 공유하고 함께 달려봐요! 🔥` });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);

      // DB에서 주간 목표 가져오기
      const guildId = channel.guild.id;
      const { rows } = await pool.query('SELECT user_id, goal FROM weekly_goals WHERE guild_id = $1', [guildId]);

      if (rows.length > 0) {
        let goalMessages = '이번 주 목표를 설정한 멤버들의 목표입니다! 모두 화이팅! 💪\n\n';
        for (const row of rows) {
          goalMessages += `<@${row.user_id}>님의 목표: **${row.goal}**\n`;
        }
        await thread.send(goalMessages);
        console.log(`✅ ${rows.length}명의 주간 목표를 스레드에 게시했습니다.`);
      } else {
        console.log('게시할 주간 목표가 없습니다.');
      }

    } catch (error) {
      console.error("스레드 생성 및 목표 게시 중 오류가 발생했습니다:", error);
    }
  },
};
