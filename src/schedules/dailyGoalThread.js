import pool from '../db.js';

const channelId = process.env.DAILY_GOAL_CHANNEL_ID;

const task = async (client) => {
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

    const result = await pool.query('SELECT user_id, goal FROM weekly_goals');
    const weeklyGoals = result.rows;

    let goalMessage = weeklyGoals
      .map((row) => {
        return `<@${row.user_id}>님의 주간 목표: ${row.goal}`;
      })
      .join('\n');

    if (weeklyGoals.length === 0) {
      goalMessage = '아직 주간 목표를 설정한 사람이 없어요. 새로운 한 주, 힘차게 시작해봐요! 💪';
    }

    await thread.send({
      content: `@everyone 이번 주 주간 목표를 공유한 분들의 다짐을 마음에 새기고, 오늘의 목표를 공유해주세요! 🔥

${goalMessage}`,
    });
    console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);

  } catch (error) {
    console.error("스레드 생성 및 목표 게시 중 오류가 발생했습니다:", error);
  }
};

export const dailyGoalThreadMondayJob = {
  // 매주 월요일 오전 10시 10분
  schedule: "10 10 * * 1",
  task,
};

export const dailyGoalThreadOtherDaysJob = {
  // 매주 화, 목, 금 오전 9시 40분
  schedule: "40 9 * * 2,4,5",
  task,
};