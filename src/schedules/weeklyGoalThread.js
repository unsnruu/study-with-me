const channelId = process.env.WEEKLY_GOAL_CHANNEL_ID;

export const weeklyGoalSetupThreadJob = {
  // 매주 월요일 오전 9시 40분
  schedule: "40 9 * * 1",
  async task(client) {
    console.log("⏰ 주간 목표 설정 스레드 생성 작업을 시작합니다.");
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased() || !("threads" in channel)) {
        console.error("주간 목표 채널을 찾을 수 없거나 스레드를 지원하는 텍스트 채널이 아닙니다.");
        return;
      }

      const today = new Date();
      const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

      const thread = await channel.threads.create({
        name: `🚀 ${dateString} | 이번 주 목표를 설정하고 공유해주세요!`, // Thread name remains the same
      });
      await thread.send({ content: `@everyone 이번 주의 목표를 세워 볼 시간입니다! \`/주간목표\` 명령어를 사용해서 각자의 목표를 설정하고 공유해주세요. 함께 멋진 한 주를 만들어봐요! 💪` });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);
    } catch (error) {
      console.error("주간 목표 설정 스레드 생성 중 오류가 발생했습니다:", error);
    }
  },
};
