import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountData = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountData) {
    console.error('FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
}

const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            let serviceAccount;
            try {
                // Handle potential escaped newlines from environment variables
                const cleanedServiceAccount = serviceAccountData?.replace(/\\n/g, '\n');
                serviceAccount = JSON.parse(cleanedServiceAccount || '{}');
            } catch (e) {
                console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e);
                throw new Error('Invalid Firebase configuration format');
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Protocol Initialized');
        }
    } catch (error) {
        console.error('❌ Firebase Initialization Error:', error);
        // Don't crash immediately, allow other services to potentially start
    }
};

initializeFirebase();

export const db = admin.firestore();
export const auth = admin.auth();
export const getFirestore = () => db;
export default admin;
