import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN not found in environment variables!');
    process.exit(1);
}

const generateTestToken = (userId: number, firstName: string, username: string, isAdmin: boolean = false) => {
    const user = {
        id: userId,
        first_name: firstName,
        username: username,
        language_code: 'en'
    };

    const authDate = Math.floor(Date.now() / 1000);
    const params = new URLSearchParams();
    params.append('auth_date', authDate.toString());
    params.append('query_id', 'AAGLnlQAAAAAAAueVABt');
    params.append('user', JSON.stringify(user));

    // Sort keys alphabetically
    const dataCheckString = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(BOT_TOKEN)
        .digest();

    const hash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    params.append('hash', hash);

    return params.toString();
};

const userId = 123456789; // Replace with a test ID
const token = generateTestToken(userId, 'Test Admin', 'test_admin', true);

console.log('\n🔐 Generated Valid Telegram InitData:\n');
console.log(token);
console.log('\n📋 Use this in your Authorization header:');
console.log(`Authorization: Bearer ${token}`);
console.log('\n(This token will expire in 24 hours)');
