import { useState, useEffect } from 'react';

// TypeScript interface for Telegram WebApp
interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id?: string;
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
        };
        auth_date?: number;
        hash?: string;
        start_param?: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: any;
    MainButton: any;
    HapticFeedback: any;
    ready: () => void;
    expand: () => void;
    close: () => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
    showPopup: (params: any, callback?: (buttonId: string) => void) => void;
    openLink: (url: string, options?: any) => void;
    openTelegramLink: (url: string) => void;
    openInvoice: (url: string, callback?: (status: string) => void) => void;
    sendData: (data: string) => void;
    setHeaderColor?: (color: string) => void;
    setBackgroundColor?: (color: string) => void;
}

// Mock Telegram WebApp object for browser testing
const mockWebApp: TelegramWebApp = {
    initData: 'dev_bypass_token', // Use dev bypass for local testing
    initDataUnsafe: {
        user: {
            id: 999999,
            first_name: 'Dev',
            last_name: 'User',
            username: 'developer',
            language_code: 'en',
            is_premium: false,
        },
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'mock_hash',
        start_param: undefined,
    },
    version: '6.0',
    platform: 'web',
    colorScheme: 'dark',
    themeParams: {
        bg_color: '#050505',
        text_color: '#ffffff',
        hint_color: '#aaaaaa',
        link_color: '#B2FF41',
        button_color: '#B2FF41',
        button_text_color: '#000000',
    },
    isExpanded: true,
    viewportHeight: 600,
    viewportStableHeight: 600,
    headerColor: '#050505',
    backgroundColor: '#050505',
    isClosingConfirmationEnabled: false,
    BackButton: {
        isVisible: false,
        show: () => console.log('BackButton shown'),
        hide: () => console.log('BackButton hidden'),
        onClick: () => console.log('BackButton clicked'),
    },
    MainButton: {
        text: '',
        color: '#B2FF41',
        textColor: '#000000',
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText: (text: string) => console.log('MainButton text:', text),
        show: () => console.log('MainButton shown'),
        hide: () => console.log('MainButton hidden'),
        enable: () => console.log('MainButton enabled'),
        disable: () => console.log('MainButton disabled'),
        showProgress: () => console.log('MainButton progress shown'),
        hideProgress: () => console.log('MainButton progress hidden'),
        onClick: () => console.log('MainButton clicked'),
    },
    HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') =>
            console.log('Haptic impact:', style),
        notificationOccurred: (type: 'error' | 'success' | 'warning') =>
            console.log('Haptic notification:', type),
        selectionChanged: () => console.log('Haptic selection changed'),
    },
    ready: () => console.log('✅ Telegram WebApp ready (mock)'),
    expand: () => console.log('📱 Expanded to fullscreen (mock)'),
    close: () => console.log('❌ Closing app (mock)'),
    enableClosingConfirmation: () => console.log('🔒 Closing confirmation enabled'),
    disableClosingConfirmation: () => console.log('🔓 Closing confirmation disabled'),
    showAlert: (message: string, callback?: () => void) => {
        alert(message);
        callback?.();
    },
    showConfirm: (message: string, callback?: (confirmed: boolean) => void) => {
        const result = confirm(message);
        callback?.(result);
    },
    showPopup: (params: any, callback?: (buttonId: string) => void) => {
        console.log('Popup:', params);
        callback?.('ok');
    },
    openLink: (url: string) => window.open(url, '_blank'),
    openTelegramLink: (url: string) => window.open(url, '_blank'),
    openInvoice: (url: string, callback?: (status: string) => void) => {
        window.open(url, '_blank');
        callback?.('paid');
    },
    sendData: (data: string) => console.log('Sending data to bot:', data),
    setHeaderColor: (color: string) => console.log('Set header color:', color),
    setBackgroundColor: (color: string) => console.log('Set background color:', color),
};

const useTelegram = () => {
    const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Check if running inside Telegram
        if ((window as any).Telegram?.WebApp) {
            const app = (window as any).Telegram.WebApp as TelegramWebApp;

            // Initialize Telegram WebApp
            app.ready();
            app.expand();

            // Set theme colors
            if (app.setHeaderColor) {
                (app as any).setHeaderColor('#050505');
            }
            if (app.setBackgroundColor) {
                (app as any).setBackgroundColor('#050505');
            }

            console.log('✅ Telegram WebApp initialized');
            console.log('📱 Platform:', app.platform);
            console.log('👤 User:', app.initDataUnsafe.user);

            setWebApp(app);
            setIsReady(true);
        } else {
            // Fallback for development outside Telegram
            console.warn('⚠️ Telegram WebApp not detected. Using mock data for development.');
            setWebApp(mockWebApp);
            setIsReady(true);
        }
    }, []);

    return {
        webApp,
        initData: webApp?.initData || '',
        user: webApp?.initDataUnsafe?.user || null,
        isReady,
        platform: webApp?.platform || 'unknown',
        colorScheme: webApp?.colorScheme || 'dark',
        startParam: webApp?.initDataUnsafe?.start_param || null, // For referral tracking
    };
};

export default useTelegram;
