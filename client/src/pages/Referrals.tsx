import { motion } from 'framer-motion';
import {
    Users,
    Gift,
    Copy,
    Share2,
    TrendingUp,
    ChevronRight,
    Award,
    Network,
    Cpu,
    Zap,
    Coins,
    DollarSign,
    Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';
import { formatCurrency } from './Earn';

const Referrals = () => {
    const { webApp, initData } = useTelegram();
    const [referralData, setReferralData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/referrals`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setReferralData(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch referrals');
            } finally {
                setLoading(false);
            }
        };
        if (initData) fetchReferrals();
        else {
            // Mock data for dev
            setReferralData({
                referralCount: 12,
                totalEarnings: 600, // 600 EC = 6,000 NGN
                referralLink: `https://t.me/EarnifyBot?start=ref_12345`
            });
            setLoading(false);
        }
    }, [initData]);

    const copyLink = () => {
        const link = referralData?.referralLink || `https://t.me/EarnifyBot?start=${webApp?.initDataUnsafe?.user?.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (webApp) webApp.HapticFeedback.notificationOccurred('success');
    };

    const shareLink = () => {
        const link = referralData?.referralLink || `https://t.me/EarnifyBot?start=${webApp?.initDataUnsafe?.user?.id}`;
        const text = "🚀 Join Earnify Protocol and start yielding EC nodes daily! Use my link to get a 50 EC starter bonus:";
        window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`);
    };

    if (loading) return null;

    const currency = formatCurrency(referralData?.totalEarnings || 0);

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <header className="mb-14 relative z-10 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Affiliate Protocol</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Network <span className="text-[#B2FF41]">Nexus</span></h1>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">Multi-Level Liquidity Expansion</p>
            </header>

            {/* Network Visualization (Abstract SVG) */}
            <div className="relative h-48 mb-14 z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-radial-gradient from-[#B2FF41]/5 to-transparent blur-3xl" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="relative w-40 h-40 border border-white/5 rounded-full flex items-center justify-center"
                >
                    <div className="absolute inset-2 border border-[#B2FF41]/10 rounded-full border-dashed" />
                    <div className="absolute inset-8 border border-white/5 rounded-full" />
                    <Network className="text-[#B2FF41]/40" size={48} />

                    {/* Orbiting Nodes */}
                    {[0, 72, 144, 216, 288].map((deg, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-[#B2FF41] rounded-full shadow-[0_0_10px_#B2FF41]"
                            style={{
                                transform: `rotate(${deg}deg) translateX(80px)`
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                <StatCard
                    label="Active Nodes"
                    value={referralData?.referralCount || 0}
                    icon={<Users size={16} />}
                    color="#B2FF41"
                />
                <StatCard
                    label="Nexus Yield"
                    value={`${currency.ec} EC`}
                    icon={<TrendingUp size={16} />}
                    color="#FFFFFF"
                    subValue={currency.usd}
                />
            </div>

            {/* Referral Link Terminal */}
            <div className="premium-card p-10 bg-[#0A0A0A] border-white/[0.05] relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B2FF41]/5 blur-3xl" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight italic">Relay Vector</h4>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Authorize new network nodes</p>
                    </div>
                </div>

                <div className="bg-[#050505] rounded-[1.8rem] p-6 border border-white/[0.03] mb-8">
                    <p className="text-[10px] text-white/10 font-bold uppercase tracking-[0.2em] mb-4 text-center">Protocol Reference URL</p>
                    <p className="text-center font-mono text-[11px] text-[#B2FF41]/60 tracking-wider break-all px-2">
                        {referralData?.referralLink || `https://t.me/EarnifyBot?start=${webApp?.initDataUnsafe?.user?.id}`}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={copyLink}
                        className="h-16 rounded-2xl bg-[#121212] flex items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest group"
                    >
                        {copied ? <Check size={18} className="text-[#B2FF41]" /> : <Copy size={18} className="text-white/20 group-hover:text-white" />}
                        {copied ? "COPIED" : "COPY"}
                    </button>
                    <button
                        onClick={shareLink}
                        className="h-16 rounded-2xl bg-[#B2FF41] text-black flex items-center justify-center gap-3 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest shadow-xl"
                    >
                        <Share2 size={18} />
                        SHARE
                    </button>
                </div>
            </div>

            {/* Level Progress */}
            <div className="mt-10 bg-[#121212]/50 border border-white/5 rounded-[2.5rem] p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-[#B2FF41]">Network Tier 2</p>
                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">Next Unlock: 50 EC / Node</p>
                    </div>
                    <Award className="text-[#B2FF41]" size={20} />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-[#B2FF41]"
                    />
                </div>
                <div className="flex justify-between mt-3">
                    <span className="text-[9px] font-black text-white/20">12 NODES</span>
                    <span className="text-[9px] font-black text-white/20">20 NODES</span>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, subValue }: any) => (
    <div className="premium-card p-6 border-l-2" style={{ borderLeftColor: color }}>
        <div className="flex items-center gap-3 mb-3 opacity-30" style={{ color: color }}>
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <h4 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: color }}>{value}</h4>
        {subValue && (
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">{subValue}</p>
        )}
    </div>
);

export default Referrals;
