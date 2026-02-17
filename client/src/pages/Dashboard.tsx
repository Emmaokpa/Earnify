import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Plus,
    Zap,
    TrendingUp,
    Clock,
    Coins,
    DollarSign,
    Crown,
    History
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';
import { formatCurrency } from './Earn';

const Dashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
    const { webApp, initData } = useTelegram();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [activeTxTab, setActiveTxTab] = useState('all');

    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);
    const timerRef = useRef<any>(null);

    const updateTimer = useCallback((nextClaimDate: Date) => {
        const now = new Date();
        const diff = nextClaimDate.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeLeft(null);
            setDashboardData((prev: any) => ({ ...prev, canClaim: true }));
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ h, m, s });
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            const data = await response.json();
            if (data.success) {
                const dashboard = data.dashboard;
                setDashboardData({
                    ...dashboard,
                    canClaim: dashboard.dailyStatus.canClaim,
                    nextClaimIn: dashboard.dailyStatus.nextClaimIn
                });

                if (!dashboard.dailyStatus.canClaim) {
                    const nextDate = new Date();
                    nextDate.setHours(nextDate.getHours() + dashboard.dailyStatus.nextClaimIn);

                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => updateTimer(nextDate), 1000);
                    updateTimer(nextDate);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    }, [initData, updateTimer]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleDailyClaim = async () => {
        if (!dashboardData?.canClaim) return;

        try {
            const response = await fetch(`${config.apiBaseUrl}/tasks/daily-claim`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            const data = await response.json();

            if (data.success) {
                webApp?.HapticFeedback.notificationOccurred('success');
                webApp?.showAlert(`Authorized: ${data.reward} EC Transferred to Vault.`);
                fetchDashboardData();
            } else {
                webApp?.showAlert(data.message || 'Protocol Error');
            }
        } catch (error) {
            webApp?.showAlert('Connectivity Failed');
        }
    };

    useEffect(() => {
        if (initData) {
            fetchDashboardData();
        } else {
            // Mock data for dev visibility (Naira converted to EC for display)
            setTimeout(() => {
                setDashboardData({
                    balance: 2460, // 2460 EC = 24,600 NGN
                    pendingBalance: 73.8,
                    totalEarned: 2500,
                    dailyStreak: 7,
                    recentTransactions: [
                        { id: 1, name: 'Ad Reward', amount: 0.5, type: 'credit', category: 'earned', time: '10:30 AM' },
                        { id: 2, name: 'Referral Bonus', amount: 5, type: 'credit', category: 'earned', time: 'Yesterday' },
                        { id: 3, name: 'Withdrawal', amount: 50, type: 'debit', category: 'withdrawn', time: '2 days ago' }
                    ]
                });
                setLoading(false);
            }, 800);
        }
    }, [initData, fetchDashboardData]);

    const filteredTransactions = dashboardData?.recentTransactions?.filter((tx: any) => {
        if (activeTxTab === 'all') return true;
        return tx.category === activeTxTab;
    });

    if (loading) return null;

    const currency = formatCurrency(dashboardData?.balance || 0);

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-14 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            {/* Header */}
            <header className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-[1.2rem] overflow-hidden border border-white/10 p-0.5 bg-gradient-to-br from-[#B2FF41]/20 to-transparent">
                            <img
                                src={`https://ui-avatars.com/api/?name=${webApp?.initDataUnsafe?.user?.first_name || 'U'}&background=121212&color=B2FF41&bold=true`}
                                alt="avatar"
                                className="w-full h-full rounded-[1rem] object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#B2FF41] rounded-full flex items-center justify-center border-2 border-[#050505]">
                            <TrendingUp size={10} className="text-black" />
                        </div>
                    </div>
                    <div>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5">Welcome Back</p>
                        <h2 className="text-lg font-black tracking-tight uppercase italic">{webApp?.initDataUnsafe?.user?.first_name || 'User'} <span className="text-[#B2FF41]">👋</span></h2>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            webApp?.HapticFeedback.impactOccurred('light');
                            onNavigate?.('premium');
                        }}
                        className="w-12 h-12 rounded-2xl bg-[#B2FF41]/10 flex items-center justify-center border border-[#B2FF41]/20 hover:bg-[#B2FF41]/20 transition-all active:scale-95 group shadow-[0_0_20px_rgba(178,255,65,0.1)]"
                    >
                        <Crown size={20} className="text-[#B2FF41]" />
                    </button>
                    <button
                        onClick={() => webApp?.HapticFeedback.impactOccurred('light')}
                        className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center border border-white/[0.05] hover:border-[#B2FF41]/30 transition-all active:scale-95 group"
                    >
                        <Bell size={20} className="text-white/40 group-hover:text-[#B2FF41]" />
                    </button>
                </div>
            </header>

            {/* Premium Balance Card */}
            <section className="mb-12 relative z-10">
                <div className="premium-card p-10 bg-gradient-to-br from-[#121212] to-black">
                    <div className="shimmer" />
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Coins size={14} className="text-[#B2FF41]" />
                                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em]">Vault Liquidity</p>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter italic">
                                {currency.ec.toLocaleString()} <span className="text-3xl text-[#B2FF41]">EC</span>
                            </h1>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="bg-[#B2FF41]/10 px-3 py-1.5 rounded-xl border border-[#B2FF41]/20">
                                <p className="text-[#B2FF41] text-[10px] font-black uppercase tracking-widest">+12.7%</p>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <DollarSign size={10} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{currency.usd}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] rounded-2xl p-4 flex items-center justify-between border border-white/[0.03]">
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-white/20" />
                            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Locked Yield</span>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-black text-white/80 tracking-tight italic">{dashboardData?.pendingBalance?.toLocaleString() || '0.00'} EC</span>
                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{formatCurrency(dashboardData?.pendingBalance || 0).usd}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Streak Module */}
            <section className="mb-12 relative z-10">
                <button
                    onClick={() => {
                        webApp?.HapticFeedback.impactOccurred('medium');
                        handleDailyClaim();
                    }}
                    disabled={!dashboardData?.canClaim}
                    className={`w-full py-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden group shadow-2xl ${dashboardData?.canClaim
                        ? 'bg-[#B2FF41] text-black hover:scale-[1.02] active:scale-95'
                        : 'bg-[#121212] text-white/20 border border-white/5 grayscale pointer-events-none'
                        }`}
                >
                    {dashboardData?.canClaim && <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />}
                    <div className="flex items-center gap-3">
                        <Zap size={28} className={dashboardData?.canClaim ? 'animate-bounce' : ''} />
                        <span className="text-2xl font-black uppercase italic tracking-tighter">
                            {dashboardData?.canClaim ? 'Authorize Daily Yield' : 'Protocol Cooldown'}
                        </span>
                    </div>
                    {dashboardData?.canClaim ? (
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Available for Synchronization</p>
                    ) : timeLeft ? (
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#B2FF41] animate-pulse">
                            <Clock size={14} />
                            <span>NODE RESET: {timeLeft.h}H {timeLeft.m}M {timeLeft.s}S</span>
                        </div>
                    ) : (
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initializing Node...</p>
                    )}
                </button>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 gap-4 mb-14 relative z-10">
                <ActionCard
                    icon={<Plus size={24} />}
                    title="Add EC"
                    subtitle="Deposit Stars"
                    color="#B2FF41"
                    onClick={() => {
                        webApp?.HapticFeedback.impactOccurred('light');
                        onNavigate?.('withdraw');
                    }}
                />
                <ActionCard
                    icon={<TrendingUp size={24} />}
                    title="Transfer"
                    subtitle="Bank Relay"
                    color="#FFFFFF"
                    onClick={() => {
                        webApp?.HapticFeedback.impactOccurred('light');
                        onNavigate?.('withdraw');
                    }}
                />
            </section>

            {/* Recent Activity */}
            <section className="relative z-10">
                <div className="flex justify-between items-center mb-10 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-[#B2FF41] rounded-full" />
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] italic leading-none">Activity Matrix</h3>
                    </div>
                </div>

                <div className="flex bg-[#121212] p-1.5 rounded-2xl border border-white/5 mb-8">
                    <TxTab active={activeTxTab === 'all'} onClick={() => { setActiveTxTab('all'); webApp?.HapticFeedback.selectionChanged(); }}>Global</TxTab>
                    <TxTab active={activeTxTab === 'earned'} onClick={() => { setActiveTxTab('earned'); webApp?.HapticFeedback.selectionChanged(); }}>Yield</TxTab>
                    <TxTab active={activeTxTab === 'withdrawn'} onClick={() => { setActiveTxTab('withdrawn'); webApp?.HapticFeedback.selectionChanged(); }}>Payout</TxTab>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredTransactions?.map((tx: any) => (
                            <motion.div
                                key={tx.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center justify-between p-5 bg-[#121212] rounded-[2rem] border border-white/[0.03] group hover:bg-[#1A1A1A] transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center text-[#B2FF41] group-hover:scale-110 transition-transform">
                                        <History size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-sm tracking-tight group-hover:text-[#B2FF41] transition-colors">{tx.name}</h4>
                                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1 italic">{tx.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <p className={`font-black text-lg italic tracking-tighter ${tx.type === 'debit' ? 'text-white/40' : 'text-[#B2FF41] text-glow'}`}>
                                            {tx.type === 'debit' ? '-' : '+'}{tx.amount}
                                        </p>
                                        <span className="text-[10px] font-black text-white/20">EC</span>
                                    </div>
                                    <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.2em]">{formatCurrency(tx.amount).ngn}</p>
                                </div>
                            </motion.div>
                        )) || (
                                <div className="text-center py-20 bg-[#121212] rounded-[2.5rem] border border-dashed border-white/5">
                                    <History size={40} className="mx-auto mb-4 text-white/10" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Ledger Null</span>
                                </div>
                            )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

const ActionCard = ({ icon, title, subtitle, color, onClick }: any) => (
    <button
        onClick={onClick}
        className="premium-card p-6 flex flex-col items-start gap-4 hover:bg-[#1A1A1A] transition-colors tap-effect group min-h-[140px]"
    >
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all"
            style={{
                backgroundColor: `${color}10`,
                borderColor: `${color}20`,
                color: color
            }}
        >
            {icon}
        </div>
        <div>
            <h4 className="font-black text-sm uppercase tracking-tight italic" style={{ color: color }}>{title}</h4>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 italic leading-tight">{subtitle}</p>
        </div>
        <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/20 transition-colors">
            <Plus size={40} />
        </div>
    </button>
);

const TxTab = ({ children, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
            ? 'bg-[#B2FF41] text-black shadow-lg shadow-[#B2FF41]/20'
            : 'text-white/30 hover:text-white/50'
            }`}
    >
        {children}
    </button>
);

export default Dashboard;
