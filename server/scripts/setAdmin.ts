import { getFirestore } from '../src/config/firebase';

/**
 * Script to set admin status for users
 * Usage: npx ts-node scripts/setAdmin.ts
 */

async function setAdmin(telegramId: string, isAdmin: boolean = true) {
    try {
        const db = getFirestore();
        const userRef = db.collection('users').doc(telegramId);

        // Check if user exists
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log(`⚠️  User ${telegramId} not found. Creating user first...`);
            // You might want to create the user here or ask them to log in first
            return;
        }

        await userRef.update({
            isAdmin: isAdmin,
            updatedAt: new Date()
        });

        console.log(`✅ Successfully set isAdmin=${isAdmin} for user ${telegramId}`);
        console.log(`   Name: ${userDoc.data()?.firstName} ${userDoc.data()?.lastName}`);
        console.log(`   Username: @${userDoc.data()?.username || 'N/A'}`);

    } catch (error) {
        console.error('❌ Error setting admin status:', error);
    }
}

async function listAdmins() {
    try {
        const db = getFirestore();
        const adminsSnapshot = await db.collection('users')
            .where('isAdmin', '==', true)
            .get();

        if (adminsSnapshot.empty) {
            console.log('📋 No admins found.');
            return;
        }

        console.log('\n📋 Current Admins:');
        console.log('─'.repeat(60));
        adminsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`ID: ${doc.id}`);
            console.log(`Name: ${data.firstName} ${data.lastName}`);
            console.log(`Username: @${data.username || 'N/A'}`);
            console.log(`Balance: ${data.balance} EC`);
            console.log('─'.repeat(60));
        });

    } catch (error) {
        console.error('❌ Error listing admins:', error);
    }
}

// Main execution
async function main() {
    console.log('🔧 Earnify Admin Management Tool\n');

    // Set dev user as admin (for local testing)
    await setAdmin('999999', true);

    // Add your real Telegram ID here
    // Get your ID from @userinfobot or @RawDataBot
    // await setAdmin('YOUR_TELEGRAM_ID', true);

    // List all current admins
    await listAdmins();

    console.log('\n✅ Done!');
    process.exit(0);
}

main();
