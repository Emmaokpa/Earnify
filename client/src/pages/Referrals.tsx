import { motion } from 'framer-motion';
import {
    Users,
    Copy,
    Share2,
    TrendingUp,
    Gift,
    ArrowUpRight,
    UserPlus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Referrals = () => {
    const { webApp, initData } = useTelegram();
    const [stats, setStats] = useState<any>(null);
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        // Generate referral link based on user's referral code
        const user = webApp?.initDataUnsafe?.user;
        if (user) {
            // In a real app, we'd get the actual referral code from the backend
            // For now, using ID as a placeholder until data is fetched
            setReferralLink(`https://t.me/EarnifyBot?start=${user.id}`);
        }

        const fetchStats = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setStats(data.dashboard.referralStats);
                    if (data.dashboard.referralCode) {
                        setReferralLink(`https://t.me/EarnifyBot?start=${data.dashboard.referralCode}`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch referral stats');
            }
        };

        if (initData) fetchStats();
    }, [initData, webApp]);

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const shareLink = () => {
        if (webApp) {
            const text = `💰 Join me on Earnify and start earning real cash today! Use my link to get a bonus.`;
            const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
            webApp.openTelegramLink(url);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32">
            <div className="mesh-gradient" />

            <motion.header
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-12"
            >
                <div className="w-20 h-20 rounded-[2.5rem] bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                    <Users size={40} className="text-[#00FF88]" />
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter mb-2">NETWORK GROWTH</h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Build your empire, Earn lifetime 10%</p>
            </motion.header>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass-card p-6 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Network</p>
                    <p className="text-2xl font-black text-[#00FF88]">{stats?.totalReferrals || 0}</p>
                </div>
                <div className="glass-card p-6 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Earned</p>
                    <p className="text-2xl font-black text-blue-500">₦{(stats?.totalEarned || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Referral Link Card */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card p-8 mb-8 border-dashed border-white/10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <UserPlus size={16} className="text-orange-400" />
                    </div>
                    <h3 className="font-black text-sm uppercase tracking-tight">Active Recruitment Link</h3>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 truncate flex-1 pr-4">{referralLink || 'Initializing...'}</span>
                    <button onClick={copyLink} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Copy size={16} className="text-white/60" />
                    </button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={shareLink}
                    className="btn-sleek-primary w-full py-5 text-black font-black uppercase tracking-widest flex items-center justify-center gap-3"
                >
                    <Share2 size={20} />
                    Forward to Friends
                </motion.button>
            </motion.section>

            {/* Commission Tiers */}
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">Yield Structure</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="space-y-4">
                <div className="glass-card p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-[#00FF88]/10 group-hover:text-[#00FF88] transition-all">
                            <Gift size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase">Recruitment Bonus</h4>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Instant ₦50.00 per referral</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-[#00FF88]">ACTIVE</span>
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase">Lifetime Yield</h4>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">10% of all their task earnings</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-blue-400">PASSIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referrals;
