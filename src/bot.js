// src/bot.js
import "dotenv/config";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";

// 1️⃣ 클라이언트 생성 (봇 객체)
const client = new Client({
  intents: [GatewayIntentBits.Guilds], // 슬래시 커맨드엔 Guilds만으로 충분
  partials: [Partials.Channel],
});

// 2️⃣ 명령어 모음 (나중에 여러 커맨드 넣을 예정)
client.commands = new Collection();

// 3️⃣ ping 명령 임시로 불러오기
import ping from "./commands/ping.js";
client.commands.set(ping.data.name, ping);

// 4️⃣ 봇이 켜질 때 로그 찍기
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 5️⃣ slash command 인터랙션 처리
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "⚠️ 명령 실행 중 오류가 발생했어요.",
      ephemeral: true,
    });
  }
});

// 6️⃣ 로그인
client.login(process.env.TOKEN);
