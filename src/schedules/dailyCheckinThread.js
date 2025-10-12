const channelId = process.env.DAILY_CHECKIN_CHANNEL_ID;

export const dailyCheckinThreadJob = {
  // 매주 월, 화, 목, 금 오전 9시 40분
  schedule: "40 9 * * 1,2,4,5",
  async task(client) {
    console.log("⏰ 출석체크 스레드 생성 작업을 시작합니다.");
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error("지정된 채널을 찾을 수 없거나 텍스트 채널이 아닙니다.");
        return;
      }

      const today = new Date();
      const dateString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

      const thread = await channel.threads.create({
        name: `✅ ${dateString} | 출석체크`,
      });
      await thread.send({ content: `@everyone 잊지 말고 출석체크 해주세요! ✍️` });
      console.log(`✅ ${thread.name} 스레드를 성공적으로 생성했습니다.`);
    } catch (error) {
      console.error("스레드 생성 중 오류가 발생했습니다:", error);
    }
  },
};
