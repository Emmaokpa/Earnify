import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let app: admin.app.App | null = null;
let db: admin.firestore.Firestore | null = null;

export const initializeFirebase = () => {
    if (!process.env.FIREBASE_PROJECT_ID) {
        console.warn('Firebase configuration missing. Skipping initialization.');
        return;
    }

    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

        if (!admin.apps.length) {
            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase initialized successfully.');
        } else {
            app = admin.app();
        }

        db = admin.firestore();
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
};

export const getFirestore = () => {
    if (!db) {
        initializeFirebase();
    }
    return db!;
};

// Initialize on start
initializeFirebase();
