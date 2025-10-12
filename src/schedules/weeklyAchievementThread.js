const channelId = process.env.WEEKLY_ACHIEVEMENT_CHANNEL_ID;

export const weeklyAchievementThreadJob = {
  // 매주 금요일 오후 4시
  schedule: "0 16 * * 5",
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
      await channel.send({ content: `@here ${thread}가 생성되었습니다!` });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);
    } catch (error) {
      console.error("스레드 생성 중 오류가 발생했습니다:", error);
    }
  },
};
