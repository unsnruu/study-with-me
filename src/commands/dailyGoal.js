import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dailygoal')
        .setDescription('Set your daily goal with a structured template!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to set the goal for.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('main-goal')
                .setDescription('Your main goal for today.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sub-goals')
                .setDescription('Your detailed sub-goals.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mood')
                .setDescription('How you are feeling today.')
                .setRequired(true)
                .addChoices(
                    { name: '🔥 열정적으로 달릴 준비 완료!', value: '🔥 열정적으로 달릴 준비 완료!' },
                    { name: '☕ 차분하고 집중 잘 될 것 같은 날', value: '☕ 차분하고 집중 잘 될 것 같은 날' },
                    { name: '😊 그냥 좋은 날', value: '😊 그냥 좋은 날' },
                    { name: '🫠 조금 지쳤지만 힘내볼게요', value: '🫠 조금 지쳤지만 힘내볼게요' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser('user');
        const mainGoal = interaction.options.getString('main-goal');
        const subGoals = interaction.options.getString('sub-goals');
        const mood = interaction.options.getString('mood');

        const replyContent = `
**<@${user.id}>님의 오늘의 목표**

**🎯 주요 목표: ${mainGoal}**

🧩 **세부 목표:**
${subGoals}

💭 **오늘의 기분:** ${mood}
        `;

        await interaction.editReply({ content: replyContent, ephemeral: false });
    },
};