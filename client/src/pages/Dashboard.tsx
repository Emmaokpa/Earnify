import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    Users,
    Zap,
    PlayCircle,
    Target,
    Gift,
    ArrowUpRight,
    ChevronRight,
    Bell,
    History,
    Info,
    ExternalLink,
    Gamepad2
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Dashboard = () => {
    const { webApp, initData } = useTelegram();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isClaiming, setIsClaiming] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${initData}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setDashboardData(data.dashboard);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [initData]);

    useEffect(() => {
        if (initData) {
            fetchDashboardData();
        } else {
            // Fallback for development if no initData
            setTimeout(() => {
                setDashboardData({
                    balance: 15750,
                    pendingBalance: 450,
                    totalEarned: 25000,
                    referralEarnings: 3200,
                    dailyStreak: 7,
                    level: 3,
                    referralStats: { totalReferrals: 12 },
                    recentTransactions: []
                });
                setLoading(false);
            }, 800);
        }
    }, [initData, fetchDashboardData]);

    const handleClaimDaily = async () => {
        if (isClaiming) return;
        setIsClaiming(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/daily-reward`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                alert(`Claimed ₦${data.reward}! New Streak: ${data.streak}`);
                fetchDashboardData();
            } else {
                alert(data.message || 'Failed to claim reward');
            }
        } catch (error) {
            alert('Error connecting to server');
        } finally {
            setIsClaiming(false);
        }
    };

    const handleWatchAd = async () => {
        // Simulate ad watch trigger (e.g. AdMob or AppLovin logic here)
        alert('Watching Ad...');
        setTimeout(async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/complete-ad`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${initData}`,
                    }
                });
                const data = await response.json();
                if (data.success) {
                    alert(`Reward added! +₦${data.reward}`);
                    fetchDashboardData();
                }
            } catch (error) {
                console.error('Ad reward failed');
            }
        }, 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505]">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                        borderRadius: ["20%", "50%", "20%"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 border-4 border-[#00FF88] border-t-transparent shadow-[0_0_20px_rgba(0,255,136,0.5)]"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-[#00FF88] font-black tracking-widest text-[10px] uppercase"
                >
                    Initializing Terminal
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="mesh-gradient" />

            {/* Header with Glassmorphism */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 px-6 py-6 backdrop-blur-xl bg-[#050505]/60 border-b border-white/5"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00FF88] to-emerald-700 p-[1px]"
                        >
                            <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center">
                                <Zap className="text-[#00FF88]" size={20} fill="#00FF88" />
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter">Earnify</h1>
                            <div className="flex items-center gap-1.5 leading-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] shadow-[0_0_5px_#00FF88]" />
                                <span className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">Alpha 1.0</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
                        >
                            <Bell size={18} className="text-white/60" />
                        </motion.button>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1 pl-1 pr-3"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${webApp?.initDataUnsafe?.user?.first_name || 'U'}&background=00FF88&color=000`}
                                alt="Profile"
                                className="w-7 h-7 rounded-full"
                            />
                            <span className="text-[11px] font-bold text-white/80">Lvl {dashboardData?.level || 1}</span>
                        </motion.div>
                    </div>
                </div>
            </motion.nav>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-6 pt-6 pb-32"
            >
                {/* Main Wallet Display */}
                <motion.section variants={itemVariants} className="mb-8">
                    <div className="glass-card-bright p-8 relative group overflow-hidden">
                        {/* Animated Shine Effect */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
                        />

                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 opacity-50">
                                    <Wallet size={12} />
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">Total Assets</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter text-white">
                                        ₦{(dashboardData?.balance || 0).toLocaleString()}
                                    </span>
                                    <div className="px-2 py-0.5 rounded-md bg-[#00FF88]/20 border border-[#00FF88]/30 flex items-center gap-1">
                                        <TrendingUp size={10} className="text-[#00FF88]" />
                                        <span className="text-[10px] font-black text-[#00FF88]">+{dashboardData?.referralStats?.totalReferrals || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                className="p-3 bg-white/5 rounded-2xl border border-white/10"
                            >
                                <History size={20} className="text-white/60" />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Available</p>
                                <p className="text-lg font-bold">₦{(dashboardData?.balance || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Pending</p>
                                <p className="text-lg font-bold text-orange-400">₦{(dashboardData?.pendingBalance || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-sleek-primary w-full mt-6 flex items-center gap-3 overflow-hidden group shadow-[0_20px_40px_-15px_rgba(0,255,136,0.3)]"
                        >
                            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-lg uppercase font-black tracking-widest">Withdraw Now</span>
                        </motion.button>
                    </div>
                </motion.section>

                {/* Action Grid */}
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">Earning Nodes</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4 mb-10">
                    <EarnCard
                        icon={<PlayCircle size={20} />}
                        title="Ad Stream"
                        subtitle="20/20 Quota"
                        reward="₦5.00"
                        color="#00FF88"
                        tag="HOT"
                        onClick={handleWatchAd}
                    />
                    <EarnCard
                        icon={<Target size={20} />}
                        title="CPA Portal"
                        subtitle="9 Tasks"
                        reward="₦50+"
                        color="#FB923C"
                        tag="+9"
                        onClick={() => alert('CPA Offerwall coming soon!')}
                    />
                    <EarnCard
                        icon={<Users size={20} />}
                        title="Network"
                        subtitle="10% Yield"
                        reward="Invite"
                        color="#60A5FA"
                        onClick={() => alert('Referral system initializing...')}
                    />
                    <EarnCard
                        icon={<Gamepad2 size={20} />}
                        title="Gama Play"
                        subtitle="Earn Gaming"
                        reward="Win ₦"
                        color="#A855F7"
                        onClick={() => alert('PlayGama Zone coming soon!')}
                    />
                </motion.section>

                {/* Daily Reward Pool */}
                <motion.section variants={itemVariants} className="mb-10">
                    <div className="glass-card p-6 border-dashed border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                    <Gift className="text-orange-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight uppercase">Daily reward pool</h3>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{dashboardData?.dailyStreak || 0} Day Streak Active</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={handleClaimDaily}
                                disabled={isClaiming}
                                className={`py-2 px-4 text-xs font-black rounded-xl transition-all ${isClaiming ? 'bg-white/10 text-white/20' : 'bg-[#00FF88] text-black shadow-lg shadow-[#00FF88]/20 hover:shadow-[#00FF88]/40'
                                    }`}
                            >
                                {isClaiming ? 'Pending...' : 'Claim Now'}
                            </motion.button>
                        </div>

                        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                <div key={day} className="flex flex-col items-center gap-2 min-w-[40px]">
                                    <div className={`w-10 h-12 rounded-lg flex items-center justify-center border font-black text-xs ${day <= (dashboardData?.dailyStreak || 0) ? 'bg-[#00FF88] text-black border-[#00FF88]' :
                                        day === (dashboardData?.dailyStreak || 0) + 1 ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30 animate-pulse' :
                                            'bg-white/5 text-white/20 border-white/10'
                                        }`}>
                                        {day}
                                    </div>
                                    <span className="text-[8px] font-bold text-white/20">DAY</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            </motion.main>
        </div>
    );
};

const EarnCard = ({ icon, title, subtitle, reward, color, tag, onClick }: any) => (
    <motion.div
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="glass-card p-4 group cursor-pointer border-t-2"
        style={{ borderTopColor: color }}
    >
        <div className="flex flex-col items-center text-center gap-3">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-500"
                style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
            >
                <div style={{ color }}>{icon}</div>
                {tag && (
                    <div className="absolute top-0 right-0 px-1 py-0.5 bg-[#00FF88] text-black text-[7px] font-black uppercase">
                        {tag}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h4 className="font-black text-[12px] tracking-tight uppercase leading-none">{title}</h4>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{subtitle}</p>
            </div>

            <div className="mt-2 py-1 px-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-black tracking-tighter" style={{ color }}>
                {reward}
            </div>
        </div>
    </motion.div>
);

export default Dashboard;
