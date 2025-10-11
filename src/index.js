// src/index.js
import "dotenv/config";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { commands } from "./commands/index.js";
import cron from "node-cron";
import { scheduleJobs } from "./schedules/index.js";

// 1️⃣ 클라이언트 생성 (봇 객체)
const client = new Client({
  intents: [GatewayIntentBits.Guilds], // 슬래시 커맨드엔 Guilds만으로 충분
  partials: [Partials.Channel],
});

// 2️⃣ 명령어 컬렉션에 등록
client.commands = new Collection();
for (const command of commands) {
  client.commands.set(command.data.name, command);
}

// 3️⃣ 봇이 켜질 때 로그 찍고, 스케줄링 시작
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // 스케줄링 시작
  console.log("⏰ 스케줄링을 시작합니다.");
  scheduleJobs.forEach((job) => {
    cron.schedule(job.schedule, () => job.task(client), {
      timezone: "Asia/Seoul",
    });
  });
});

// 4️⃣ slash command 인터랙션 처리
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    // deferReply 후에는 reply 대신 editReply 또는 followUp을 사용해야 합니다.
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "⚠️ 명령 실행 중 오류가 발생했어요.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "⚠️ 명령 실행 중 오류가 발생했어요.",
        ephemeral: true,
      });
    }
  }
});

// 5️⃣ 로그인
client.login(process.env.TOKEN);
