import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Earn from './pages/Earn';
import Referrals from './pages/Referrals';
import Withdraw from './pages/Withdraw';
import Admin from './pages/Admin';
import Games from './pages/Games';
import Social from './pages/Social';
import Leaderboard from './pages/Leaderboard';
import Premium from './pages/Premium';
import BottomNav from './components/BottomNav';
import useTelegram from './hooks/useTelegram';
import config from './config';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const { webApp, initData, startParam, isReady } = useTelegram();
    const [isAuth, setIsAuth] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [, setUserData] = useState<any>(null);

    useEffect(() => {
        if (!isReady || !initData) return;

        const syncAuth = async () => {
            try {
                // Extract referrer ID from start_param (format: ref_123456 or 123456)
                let referrerId = null;
                if (startParam) {
                    if (startParam.startsWith('ref_')) {
                        referrerId = startParam.substring(4);
                    } else {
                        referrerId = startParam;
                    }
                    console.log('📎 Referral detected:', referrerId);
                }

                const response = await fetch(`${config.apiBaseUrl}/user/auth`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${initData}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        referrerId: referrerId // Pass as string (could be Code or ID)
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setIsAuth(true);
                    setUserData(data.user);
                    setIsAdmin(data.user?.isAdmin || false);
                    console.log('✅ Authentication successful');
                    console.log('👤 User:', data.user);
                    console.log('🔑 Admin:', data.user?.isAdmin || false);

                    // Show welcome message for new users
                    if (data.isNewUser && webApp) {
                        webApp.showAlert('🚀 Welcome to Earnify Protocol! Start earning EC today.');
                    }

                    // Show referral bonus notification
                    if (referrerId && data.referralBonus && webApp) {
                        webApp.showAlert(`🎁 Referral bonus activated! You'll receive ${data.referralBonus} EC after completing your first task.`);
                    }
                } else {
                    console.error('❌ Authentication failed:', data.message);
                }
            } catch (error) {
                console.error('❌ Auth sync failed:', error);
            }
        };

        syncAuth();
    }, [webApp, initData, startParam, isReady]);

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
                {activeTab === 'earn' && <Earn onNavigate={setActiveTab} />}
                {activeTab === 'social' && <Social />}
                {activeTab === 'arena' && <Leaderboard />}
                {activeTab === 'premium' && <Premium />}
                {activeTab === 'referrals' && <Referrals />}
                {activeTab === 'withdraw' && <Withdraw onNavigate={setActiveTab} />}
                {activeTab === 'admin' && (
                    isAdmin ? <Admin /> : (
                        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-[#B2FF41]/10 flex items-center justify-center mx-auto mb-8">
                                    <svg className="w-12 h-12 text-[#B2FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black italic mb-4 uppercase">Access Restricted</h2>
                                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-8">
                                    Admin privileges required
                                </p>
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className="px-8 py-4 bg-[#B2FF41] text-black rounded-2xl font-black uppercase text-sm"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    )
                )}
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

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />
        </div>
    );
}

export default App;
