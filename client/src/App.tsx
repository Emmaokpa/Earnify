import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Earn from './pages/Earn';
import Referrals from './pages/Referrals';
import Withdraw from './pages/Withdraw';
import Admin from './pages/Admin';
import Games from './pages/Games';
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
                webApp.setHeaderColor('#050505');
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
            >
                {activeTab === 'home' && <Dashboard onNavigate={setActiveTab} />}
                {activeTab === 'earn' && <Earn />}
                {activeTab === 'referrals' && <Referrals />}
                {activeTab === 'withdraw' && <Withdraw />}
                {activeTab === 'admin' && <Admin />}
                {activeTab === 'games' && <Games />}
            </motion.div>
        );
    };

    if (initData && !isAuth) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-[#00FF88] border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-emerald-500/30">
            {/* Global Background Decoration */}
            <div className="mesh-gradient" />

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
