import { SlashCommandBuilder } from 'discord.js';
import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
	data: new SlashCommandBuilder()
		.setName('주간목표')
		.setDescription('이번 주 목표를 설정하거나 수정합니다.')
		.addStringOption(option =>
			option.setName('목표')
				.setDescription('달성할 목표를 입력하세요.')
				.setRequired(true)),
	async execute(interaction) {
		const goal = interaction.options.getString('목표');
		const userId = interaction.user.id;
		const guildId = interaction.guild.id;

		try {
			const query = `
				INSERT INTO weekly_goals (user_id, guild_id, goal)
				VALUES ($1, $2, $3)
				ON CONFLICT (user_id, guild_id)
				DO UPDATE SET goal = $3;
			`;
			await pool.query(query, [userId, guildId, goal]);
			await interaction.reply({ content: '✅ 주간 목표가 성공적으로 설정되었습니다!', ephemeral: true });
		} catch (error) {
			console.error('Error saving weekly goal:', error);
			await interaction.reply({ content: '❌ 목표를 설정하는 중에 오류가 발생했습니다.', ephemeral: true });
		}
	},
};
