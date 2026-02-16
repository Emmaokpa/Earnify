import { Telegraf, Context, Markup } from 'telegraf';
import { getFirestore } from '../config/firebase';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    console.warn('⚠️ BOT_TOKEN not found! Telegram bot functionality will be disabled.');
}

const bot = BOT_TOKEN ? new Telegraf(BOT_TOKEN) : null;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://earnify.vercel.app'; // Replace with actual URL

// Middleware to log commands
bot?.use(async (ctx, next) => {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(`Bot command processed in ${ms}ms`);
});

// START Command
bot?.start(async (ctx) => {
    const userId = ctx.from.id.toString();
    const username = ctx.from.username || 'User';
    const startPayload = ctx.payload; // Referral code if present

    console.log(`🤖 /start command from ${userId} (${username}) with payload: ${startPayload}`);

    try {
        const db = getFirestore();
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        let welcomeMessage = `🚀 *Welcome to Earnify Protocol, ${ctx.from.first_name}!* 🚀\n\n`;
        welcomeMessage += `Earn *EC Coins* by completing tasks, inviting friends, and exploring the crypto ecosystem.\n\n`;
        welcomeMessage += `👇 *Start earning now by launching the app!*`;

        // Check if user is new and has referral payload
        if (!userDoc.exists && startPayload) {
            // Logic to handle referral tracking is usually done in the WebApp upon launch
            // But we can acknowledge it here
            welcomeMessage += `\n\n🎁 You were invited by a friend! Launch the app to claim your bonus.`;
        }

        await ctx.replyWithMarkdown(welcomeMessage, Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 Launch Earnify App', WEBAPP_URL)],
            [Markup.button.url('📢 Join Community', 'https://t.me/EarnifyCommunity')],
        ]));

    } catch (error) {
        console.error('Error in /start command:', error);
        ctx.reply('An error occurred. Please try again later.');
    }
});

// BALANCE Command
bot?.command('balance', async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return ctx.reply('⚠️ Account not found. Please launch the app first to create an account.');
        }

        const data = userDoc.data();
        const balance = data?.balance || 0;

        ctx.reply(`💰 *Your Balance:*\n\n${balance.toLocaleString()} EC`, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Error in /balance:', error);
        ctx.reply('Failed to fetch balance.');
    }
});

// REFERRALS Command
bot?.command('referrals', async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
        const db = getFirestore();
        const referralDoc = await db.collection('referrals').doc(userId).get();
        const referralData = referralDoc.data();

        const count = referralData?.totalReferrals || 0;
        const earned = referralData?.totalEarned || 0;
        const link = `https://t.me/${ctx.botInfo.username}?start=${userId}`;

        let deployMessage = `🤝 *Referral Status*\n\n`;
        deployMessage += `👥 Total Referrals: *${count}*\n`;
        deployMessage += `💸 Total Earned: *${earned} EC*\n\n`;
        deployMessage += `🔗 *Your Referral Link:*\n\`${link}\``;

        ctx.replyWithMarkdown(deployMessage);

    } catch (error) {
        console.error('Error in /referrals:', error);
        ctx.reply('Failed to fetch referral stats.');
    }
});

// ADMIN Command (Protected)
bot?.command('admin', async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists || !userDoc.data()?.isAdmin) {
            return ctx.reply('⛔ Access Denied: Admin privileges required.');
        }

        ctx.reply('🔐 *Admin Mode Active*\n\nUse the Web App to manage tasks and users.', Markup.inlineKeyboard([
            [Markup.button.webApp('👑 Open Admin Panel', WEBAPP_URL)]
        ]));

    } catch (error) {
        console.error('Error in /admin:', error);
    }
});

// HELP Command
bot?.help((ctx) => {
    ctx.reply(
        '🤖 *Earnify Bot Commands*\n\n' +
        '/start - Launch the App\n' +
        '/balance - Check your EC balance\n' +
        '/referrals - Get your referral link\n' +
        '/help - Show this message',
        { parse_mode: 'Markdown' }
    );
});

// Launch bot
export const launchBot = () => {
    if (bot) {
        bot.launch().then(() => {
            console.log('🤖 Telegram Bot started successfully');
        }).catch((err) => {
            console.error('❌ Failed to start Telegram Bot:', err);
        });

        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }
};

export default bot;
