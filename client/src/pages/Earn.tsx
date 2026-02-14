import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    TrendingUp,
    Shield,
    ChevronLeft,
    Search,
    Play,
    Dribbble,
    Rocket,
    Gift,
    Target,
    Activity,
    Database,
    Cpu,
    CheckCircle2,
    Lock,
    Eye,
    RefreshCcw,
    Globe,
    Share2,
    MessageSquare,
    Heart,
    ArrowRight,
    Star,
    Sparkles,
    Trophy,
    Crown,
    AlertTriangle,
    Wallet,
    Coins,
    DollarSign,
    Users
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

// Currency Utility
// 1 EC = 10 NGN
// 1 USD approx 1600 NGN => 1 USD approx 160 EC
const COIN_TO_NGN = 10;
const NGN_TO_USD = 0.000625; // Simple fixed rate for UI

export const formatCurrency = (coins: number) => {
    const ngn = coins * COIN_TO_NGN;
    const usd = ngn * NGN_TO_USD;
    return {
        ec: Math.floor(coins),
        ngn: ngn.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
        usd: usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    };
};

// Reward Tier Configuration (EC = Earn Coins)
// New strict odds for profitability:
// 1 EC: 60%, 5 EC: 30%, 10 EC: 5%, 100 EC: 3%, 200 EC: 1.99%, Jackpot: 0.01%
const REWARDS = [
    { id: 0, label: "1 EC", value: 1, color: "#1A1A1A", weight: 60, tier: 'common' },
    { id: 1, label: "5 EC", value: 5, color: "#222222", weight: 30, tier: 'common' },
    { id: 2, label: "10 EC", value: 10, color: "#2A2A2A", weight: 5, tier: 'rare' },
    { id: 3, label: "100 EC", value: 100, color: "#333333", weight: 3, tier: 'epic' },
    { id: 4, label: "JACKPOT", value: 1000, color: "#B2FF41", weight: 0.01, tier: 'legendary' },
    { id: 5, label: "VOID", value: 0, color: "#000000", weight: 20, tier: 'loss' }, // Added VOID to balance free tiers
    { id: 6, label: "200 EC", value: 200, color: "#121212", weight: 1.99, tier: 'epic' },
    { id: 7, label: "VOID", value: 0, color: "#000000", weight: 40, tier: 'loss' }, // Split VOIDs for visual balance
];

const Earn = () => {
    const { initData, user } = useTelegram();
    const [view, setView] = useState<'main' | 'cpa' | 'spin' | 'ads' | 'social'>('main');
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/cpa/offers`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setOffers(data.offers);
                }
            } catch (error) {
                console.error('Failed to fetch offers');
            } finally {
                setLoading(false);
            }
        };
        if (initData) fetchOffers();
    }, [initData]);

    const renderView = () => {
        switch (view) {
            case 'spin': return <SpinWheelView isPremium={isPremium} onBack={() => setView('main')} />;
            case 'ads': return <AdsStreamView onBack={() => setView('main')} />;
            case 'cpa': return <CpaOffersView offers={offers} loading={loading} onBack={() => setView('main')} />;
            case 'social': return <SocialTasksView onBack={() => setView('main')} />;
            default: return <MainEarnGrid onNavigate={setView} isPremium={isPremium} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />
            <AnimatePresence mode="wait">
                {renderView()}
            </AnimatePresence>
        </div>
    );
};

const MainEarnGrid = ({ onNavigate, isPremium }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative z-10"
    >
        <header className="mb-14 px-2">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Yield Central</span>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Protocol Hub</h1>
                </div>
                {isPremium ? (
                    <div className="bg-[#B2FF41]/10 px-4 py-2 rounded-2xl border border-[#B2FF41]/20 flex items-center gap-2">
                        <Crown size={18} className="text-[#B2FF41]" />
                        <span className="text-[10px] font-black uppercase text-[#B2FF41]">Premium Node</span>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center border border-white/5">
                        <Database size={20} className="text-white/20" />
                    </div>
                )}
            </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-14">
            <EarningGridCard
                icon={<Globe size={24} />}
                title="CPA Nodes"
                reward="Up to 500 EC"
                color="#B2FF41"
                onClick={() => onNavigate('cpa')}
            />
            <EarningGridCard
                icon={<Play size={24} />}
                title="Ad Stream"
                reward="20 EC/unit"
                color="#FFFFFF"
                onClick={() => onNavigate('ads')}
            />
            <EarningGridCard
                icon={<RefreshCcw size={24} />}
                title="The Wheel"
                reward="Win 1K EC"
                color="#B2FF41"
                onClick={() => onNavigate('spin')}
                isSpecial
            />
            <EarningGridCard
                icon={<Share2 size={24} />}
                title="Social Nexus"
                reward="100 EC/task"
                color="#FFFFFF"
                onClick={() => onNavigate('social')}
            />
        </div>

        {/* Upsell Card */}
        {!isPremium && (
            <section className="mb-14 px-2">
                <div className="premium-card p-8 bg-gradient-to-r from-[#B2FF41] to-[#D4FF80] flex items-center justify-between group overflow-visible relative">
                    <div className="absolute -top-4 -right-2 text-black/10">
                        <Crown size={80} strokeWidth={3} />
                    </div>
                    <div className="flex-1 pr-4">
                        <h4 className="text-black font-black text-lg uppercase italic tracking-tighter leading-none mb-2">Upgrade to Ultra Node</h4>
                        <p className="text-black/70 text-[10px] font-bold uppercase tracking-widest leading-tight">Eliminate VOID chance • Higher Multiplier • Early Cashouts</p>
                    </div>
                    <button className="bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl whitespace-nowrap">
                        Unlock
                    </button>
                </div>
            </section>
        )}
    </motion.div>
);

const EarningGridCard = ({ icon, title, reward, color, onClick, isSpecial }: any) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`premium-card p-6 flex flex-col items-center justify-between aspect-square text-center cursor-pointer border-t-2 relative ${isSpecial ? 'bg-gradient-to-br from-[#121212] to-[#B2FF41]/5 border-t-[#B2FF41]' : 'bg-[#121212] border-t-white/10'
            }`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isSpecial ? 'bg-[#B2FF41]/10' : 'bg-[#050505] border border-white/5'}`}>
            <div className="text-white/40" style={{ color: isSpecial ? '#B2FF41' : undefined }}>{icon}</div>
        </div>
        <div className="space-y-1">
            <h4 className="font-black text-xs uppercase tracking-tighter italic leading-tight">{title}</h4>
            <div className="flex items-center justify-center gap-1">
                <Coins size={10} className="text-[#B2FF41]" />
                <span className="text-[11px] font-black text-[#B2FF41] italic">{reward}</span>
            </div>
        </div>
    </motion.div>
);

const SpinWheelView = ({ isPremium, onBack }: { isPremium: boolean, onBack: () => void }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [spinCharges, setSpinCharges] = useState(0);
    const [adUnlocking, setAdUnlocking] = useState(false);

    // Weighted Probability Logic
    const selectReward = () => {
        const roll = Math.random() * 100;
        let cumulative = 0;

        // Premium bias: Filter out VOID
        const currentRewards = isPremium
            ? REWARDS.filter(r => r.tier !== 'loss')
            : REWARDS;

        const totalWeight = currentRewards.reduce((acc, r) => acc + r.weight, 0);
        const adjustedRoll = (roll / 100) * totalWeight;

        for (const reward of currentRewards) {
            cumulative += reward.weight;
            if (adjustedRoll <= cumulative) return reward;
        }
        return currentRewards[0];
    };

    const spin = () => {
        if (spinning || spinCharges <= 0) return;

        setSpinning(true);
        setResult(null);
        setSpinCharges(prev => prev - 1);

        const selection = selectReward();
        const sectionDeg = 360 / REWARDS.length;
        // Invert to find target degree because the wheel spins, not the pointer
        const targetDeg = (REWARDS.length - selection.id) * sectionDeg;

        const extraSpins = 1800 + (Math.floor(Math.random() * 5) * 360);
        const finalDeg = rotation + extraSpins + (targetDeg - (rotation % 360));

        setRotation(finalDeg);

        setTimeout(() => {
            setSpinning(false);
            setResult(selection);
        }, 5000);
    };

    const watchAdToUnlock = () => {
        setAdUnlocking(true);
        setTimeout(() => {
            setSpinCharges(prev => prev + 1);
            setAdUnlocking(false);
        }, 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center relative z-10"
        >
            <header className="w-full flex justify-between items-center mb-10">
                <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center border border-white/5">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41]">Dynamic Vault</h3>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">RN-4 Algorithm</p>
                </div>
                <div className="bg-[#121212] px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                    <RefreshCcw size={14} className={`${spinning ? 'animate-spin' : ''} text-[#B2FF41]`} />
                    <span className="text-xs font-black italic">{spinCharges}</span>
                </div>
            </header>

            {/* Premium Notice */}
            <div className="w-full mb-8 relative">
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${isPremium ? 'bg-[#B2FF41]/10 border-[#B2FF41]/20' : 'bg-[#121212] border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <Crown size={20} className={isPremium ? 'text-[#B2FF41]' : 'text-white/10'} />
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-[#B2FF41]' : 'text-white/40'}`}>
                                {isPremium ? "Premium Node Active" : "Free Tier Active"}
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-0.5">
                                {isPremium ? "VOID outcomes disabled. Luck +500%." : "Upgrade to unlock higher reward probability."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Physical Wheel Visual */}
            <div className="relative mb-14">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 z-40 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#B2FF41] filter drop-shadow-[0_0_15px_#B2FF41]" />
                </div>

                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 5, ease: [0.15, 0.85, 0.25, 1] }}
                    className="w-[340px] h-[340px] rounded-full border-[12px] border-[#1A1A1A] bg-[#050505] shadow-[0_0_120px_rgba(178,255,65,0.08)] relative overflow-hidden"
                >
                    {/* Visual Sectors with Labels */}
                    <svg className="w-full h-full rotate-[0deg]" viewBox="0 0 100 100">
                        {REWARDS.map((reward, i) => {
                            const angle = 360 / REWARDS.length;
                            const startAngle = i * angle - (angle / 2);
                            const endAngle = (i + 1) * angle - (angle / 2);
                            const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

                            // Premium coordinated colors
                            let fillColor = i % 2 === 0 ? '#0D0D0D' : '#141414';
                            if (reward.tier === 'legendary') fillColor = '#1A3300'; // Dark Moss for Jackpot
                            if (reward.tier === 'loss') fillColor = '#000000';

                            return (
                                <path
                                    key={i}
                                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                                    fill={fillColor}
                                    stroke="rgba(178,255,65,0.05)"
                                    strokeWidth="0.2"
                                />
                            );
                        })}
                    </svg>

                    {/* High-End Labels Layer */}
                    {REWARDS.map((reward, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 flex items-start justify-center pt-10"
                            style={{ transform: `rotate(${i * (360 / REWARDS.length)}deg)` }}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${reward.tier === 'legendary' ? 'text-[#B2FF41] text-glow' : 'text-white/30'}`}>
                                {reward.label}
                            </span>
                        </div>
                    ))}

                    {/* Center Hub */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#050505] border-[6px] border-[#1A1A1A] flex items-center justify-center z-10 shadow-2xl relative">
                            <div className="absolute inset-0 rounded-full bg-[#B2FF41]/5 animate-pulse" />
                            <Sparkles size={24} className="text-[#B2FF41] opacity-60" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Results Terminal */}
            <div className="w-full text-center h-40 flex flex-col items-center justify-center mb-10">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="result"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-3"
                        >
                            {result.value > 0 ? (
                                <>
                                    <div className="flex items-center justify-center gap-2">
                                        <Trophy size={16} className="text-[#B2FF41]" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B2FF41] italic">Payout Authorized</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-6xl font-black italic text-white tracking-tighter">
                                            {result.value} <span className="text-[#B2FF41]">EC</span>
                                        </h2>
                                        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                            <span>{formatCurrency(result.value).ngn}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span>{formatCurrency(result.value).usd}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <AlertTriangle size={32} className="mx-auto text-white/20" />
                                    <h2 className="text-3xl font-black italic text-white/30 uppercase tracking-tighter">VOID OUTCOME</h2>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/10">Upgrade to Premium to bypass loss nodes</p>
                                </div>
                            )}
                        </motion.div>
                    ) : spinning ? (
                        <motion.div key="spinning" className="flex flex-col items-center gap-4">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                        className="w-2 h-2 rounded-full bg-[#B2FF41]"
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Analyzing Block Data</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <Coins size={32} className="mx-auto text-white/5" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Deposit required to spin</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Matrix */}
            <div className="w-full space-y-4">
                {spinCharges > 0 ? (
                    <button
                        onClick={spin}
                        disabled={spinning}
                        className="accent-btn w-full h-20 text-xl tracking-[0.3em] uppercase italic relative overflow-hidden group"
                    >
                        <motion.div
                            className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        />
                        {spinning ? "Processing..." : "Authorize Node"}
                    </button>
                ) : (
                    <button
                        onClick={watchAdToUnlock}
                        disabled={adUnlocking}
                        className="w-full h-20 rounded-[2.5rem] bg-white text-black flex items-center justify-center gap-4 group active:scale-95 transition-all shadow-2xl"
                    >
                        <Play size={24} fill="black" />
                        <div className="text-left">
                            <p className="text-lg font-black uppercase tracking-tight italic leading-none truncate">
                                {adUnlocking ? "Buffering Stream..." : "Unlock Spin Node"}
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Watch 30s video stream</p>
                        </div>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const AdsStreamView = ({ onBack }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="relative z-10"
    >
        <header className="flex items-center gap-6 mb-12">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center">
                <ChevronLeft size={20} />
            </button>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] italic">Ad-Stream Matrix</h3>
        </header>

        <div className="premium-card p-12 bg-[#0A0A0A] text-center mb-12 relative overflow-hidden">
            <div className="w-24 h-24 rounded-[3rem] bg-[#B2FF41]/10 flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(178,255,65,0.1)]">
                <Play size={40} className="text-[#B2FF41] fill-[#B2FF41]" />
            </div>
            <h2 className="text-2xl font-black italic mb-4 uppercase">Initialize Stream</h2>
            <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest leading-relaxed mb-10">
                Watch to yield 20 EC <br /> (approx {formatCurrency(20).ngn} / {formatCurrency(20).usd})
            </p>
            <button className="accent-btn w-full">Start Revenue Stream</button>
        </div>
    </motion.div>
);

const CpaOffersView = ({ offers, loading, onBack }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="relative z-10"
    >
        <header className="flex items-center gap-6 mb-12">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center">
                <ChevronLeft size={20} />
            </button>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] italic">Cpa Alpha Nodes</h3>
        </header>

        <div className="space-y-4">
            {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-[#121212] rounded-[2.5rem] animate-pulse" />)
            ) : (
                offers.map((offer: any) => (
                    <motion.div
                        key={offer.id}
                        className="premium-card p-6 bg-[#121212] flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#050505] border border-white/5">
                                <img src={offer.image_url} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm tracking-tight">{offer.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-white/5 text-white/40 uppercase tracking-widest border border-white/5">{offer.category || 'Discovery'}</span>
                                    <span className="text-[#B2FF41] text-[11px] font-black italic">{offer.reward / 10} EC</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#B2FF41] group-hover:text-black transition-all">
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                ))
            )}
        </div>
    </motion.div>
);

const SocialTasksView = ({ onBack }: any) => {
    const [verifying, setVerifying] = useState<number | null>(null);
    const [completed, setCompleted] = useState<number[]>([]);

    const tasks = [
        { id: 1, platform: 'Telegram', title: 'Join Earnify Alpha Channel', reward: '1 EC', icon: <MessageSquare size={18} />, link: 'https://t.me/EarnifyAlpha' },
        { id: 2, platform: 'X / Twitter', title: 'Follow Founder Node', reward: '1 EC', icon: <Share2 size={18} />, link: 'https://x.com/Earnify' },
        { id: 3, platform: 'Instagram', title: 'Like Latest Yield Post', reward: '1 EC', icon: <Heart size={18} />, link: 'https://instagram.com/Earnify' },
        { id: 4, platform: 'Telegram', title: 'Join Partner Nexus', reward: '1 EC', icon: <Users size={18} />, link: 'https://t.me/PartnerNexus' },
    ];

    const handleTask = (task: any) => {
        window.open(task.link, '_blank');
        setVerifying(task.id);

        // Protocol verification delay
        setTimeout(() => {
            setVerifying(null);
            setCompleted(prev => [...prev, task.id]);
        }, 5000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10"
        >
            <header className="flex items-center gap-6 mb-12">
                <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] italic">Social Nexus</h3>
                    <p className="text-[8px] font-bold text-[#B2FF41] uppercase tracking-[0.2em] mt-0.5 animate-pulse">Live Traffic Active</p>
                </div>
            </header>

            <div className="bg-[#B2FF41]/5 border border-[#B2FF41]/10 rounded-[2rem] p-6 mb-10 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]">
                    <Zap size={24} />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-tight text-[#B2FF41]">Network Multiplier</h4>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Earn 1 EC per Authorized Follow</p>
                </div>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => {
                    const isCompleted = completed.includes(task.id);
                    const isVerifying = verifying === task.id;

                    return (
                        <div
                            key={task.id}
                            className={`premium-card p-6 flex items-center justify-between transition-all ${isCompleted ? 'opacity-40 grayscale pointer-events-none' : 'bg-[#121212]'
                                }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${task.platform === 'Telegram' ? 'border-sky-500/20 text-sky-400' :
                                    task.platform === 'Instagram' ? 'border-pink-500/20 text-pink-400' :
                                        'border-white/10 text-white/40'
                                    } bg-black/40`}>
                                    {task.icon}
                                </div>
                                <div>
                                    <h5 className="text-[12px] font-black uppercase tracking-tight italic">{task.title}</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{task.platform}</p>
                                        <div className="w-1 h-1 rounded-full bg-white/5" />
                                        <p className="text-[#B2FF41] text-[10px] font-black italic">{task.reward}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleTask(task)}
                                disabled={isCompleted || isVerifying}
                                className={`px-6 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isCompleted ? 'bg-white/5 text-white/20' :
                                    isVerifying ? 'bg-[#B2FF41]/10 text-[#B2FF41] animate-pulse border border-[#B2FF41]/20' :
                                        'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                                    }`}
                            >
                                {isCompleted ? 'SYNCED' : isVerifying ? 'VERIFYING...' : 'INITIALIZE'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-14 p-10 bg-gradient-to-br from-[#121212] to-black border border-white/5 rounded-[2.5rem] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B2FF41]/5 blur-3xl" />
                <Users size={32} className="mx-auto text-white/10 mb-6" />
                <h4 className="text-sm font-black italic uppercase mb-2 tracking-tighter">Become an Advertiser?</h4>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                    Host your node in our network Nexus. <br /> ₦50 per authorized follower.
                </p>
                <button className="text-[9px] font-black text-[#B2FF41] uppercase tracking-[0.2em] border border-[#B2FF41]/20 px-8 py-4 rounded-2xl hover:bg-[#B2FF41]/5 transition-all">
                    View Space Pricing
                </button>
            </div>
        </motion.div>
    );
};

export default Earn;
