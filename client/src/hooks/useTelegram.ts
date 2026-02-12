import { useState, useEffect } from 'react';

// Mock Telegram WebApp object for browser testing
const mockWebApp = {
    initData: 'mock_init_data',
    initDataUnsafe: {
        user: {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'en',
        },
    },
    expand: () => console.log('Expanded'),
    close: () => console.log('Closed'),
    ready: () => console.log('Ready'),
};

const useTelegram = () => {
    const [webApp, setWebApp] = useState<any>(null);

    useEffect(() => {
        // Check if running inside Telegram
        if ((window as any).Telegram?.WebApp) {
            const app = (window as any).Telegram.WebApp;
            app.ready();
            setWebApp(app);
        } else {
            // Fallback for development outside Telegram
            console.warn('Telegram WebApp not detected. Using mock data.');
            setWebApp(mockWebApp);
        }
    }, []);

    return {
        webApp,
        initData: webApp?.initData || '',
        user: webApp?.initDataUnsafe?.user || mockWebApp.initDataUnsafe.user
    };
};

export default useTelegram;
