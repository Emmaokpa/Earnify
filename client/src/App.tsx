import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Earn from './pages/Earn';
import Referrals from './pages/Referrals';
import Withdraw from './pages/Withdraw';
import Admin from './pages/Admin';
import Games from './pages/Games';
import Social from './pages/Social';
import Premium from './pages/Premium';
import BottomNav from './components/BottomNav';
import useTelegram from './hooks/useTelegram';
import config from './config';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const { webApp, initData } = useTelegram();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (webApp) {
            webApp.expand();
            if (webApp.isVersionAtLeast('6.1') && webApp.setHeaderColor) {
                webApp.setHeaderColor('#0E0E0E');
            }
        }

        const syncAuth = async () => {
            if (!initData) return;
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/auth`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) setIsAuth(true);
            } catch (error) {
                console.error('Auth sync failed:', error);
            }
        };

        syncAuth();
    }, [webApp, initData]);

    const renderContent = () => {
        return (
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="w-full relative z-10"
            >
                {activeTab === 'home' && <Dashboard onNavigate={setActiveTab} />}
                {activeTab === 'earn' && <Earn />}
                {activeTab === 'social' && <Social />}
                {activeTab === 'premium' && <Premium />}
                {activeTab === 'referrals' && <Referrals />}
                {activeTab === 'withdraw' && <Withdraw />}
                {activeTab === 'admin' && <Admin />}
                {activeTab === 'games' && <Games />}
            </motion.div>
        );
    };

    if (initData && !isAuth) {
        return (
            <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center relative">
                <div className="gradient-mesh" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-[#B2FF41]/20 border-t-[#B2FF41] rounded-full"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]"
                >
                    Loading Protocol
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0E0E0E] font-inter">
            <div className="gradient-mesh" />

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
