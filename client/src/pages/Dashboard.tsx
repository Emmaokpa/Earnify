import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Bell,
    Plus,
    Zap,
    Users,
    ChevronRight,
    History,
    TrendingUp,
    ShieldCheck,
    Clock,
    Coins,
    DollarSign,
    Wallet
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';
import { formatCurrency } from './Earn';

const Dashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
    const { webApp, initData } = useTelegram();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [activeTxTab, setActiveTxTab] = useState('all');

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                headers: { 'Authorization': `Bearer ${initData}` }
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
                <button className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center border border-white/[0.05] hover:border-[#B2FF41]/30 transition-all active:scale-95 group">
                    <Bell size={20} className="text-white/40 group-hover:text-[#B2FF41]" />
                </button>
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

            {/* Main Action Hub */}
            <section className="grid grid-cols-2 gap-5 mb-12 relative z-10">
                <ActionCard
                    icon={<Zap size={24} />}
                    title="Protocols"
                    subtitle="Initialize Yield"
                    color="#B2FF41"
                    onClick={() => onNavigate?.('earn')}
                />
                <ActionCard
                    icon={<Wallet size={24} />}
                    title="Treasury"
                    subtitle="Payout Hub"
                    color="#FFFFFF"
                    onClick={() => onNavigate?.('withdraw')}
                />
            </section>

            {/* Integrated Ledger History */}
            <section className="mt-4 relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-lg font-black tracking-tight uppercase italic">Asset Ledger</h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Transaction Node Logs</p>
                    </div>
                    <button className="text-[10px] font-black text-[#B2FF41] uppercase tracking-widest bg-[#B2FF41]/10 px-4 py-2 rounded-xl border border-[#B2FF41]/20">History</button>
                </div>

                <div className="flex gap-2 mb-8 p-1.5 bg-[#121212] rounded-2xl border border-white/[0.03]">
                    <TxTab active={activeTxTab === 'all'} onClick={() => setActiveTxTab('all')}>All</TxTab>
                    <TxTab active={activeTxTab === 'earned'} onClick={() => setActiveTxTab('earned')}>Yield</TxTab>
                    <TxTab active={activeTxTab === 'withdrawn'} onClick={() => setActiveTxTab('withdrawn')}>Payout</TxTab>
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
