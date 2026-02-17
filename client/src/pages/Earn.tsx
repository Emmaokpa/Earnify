import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Play,
    RefreshCcw,
    Share2,
    ArrowRight,
    Sparkles,
    Trophy,
    Crown,
    AlertTriangle,
    Coins,
    Database,
    Globe,
    History,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';
// @ts-ignore
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

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
const REWARDS = [
    { id: 0, label: "1 EC", value: 1, color: "#1A1A1A", weight: 60, tier: 'common' },
    { id: 1, label: "5 EC", value: 5, color: "#222222", weight: 30, tier: 'common' },
    { id: 2, label: "10 EC", value: 10, color: "#2A2A2A", weight: 5, tier: 'rare' },
    { id: 3, label: "100 EC", value: 100, color: "#333333", weight: 3, tier: 'epic' },
    { id: 4, label: "JACKPOT", value: 1000, color: "#B2FF41", weight: 0.01, tier: 'legendary' },
    { id: 5, label: "VOID", value: 0, color: "#000000", weight: 20, tier: 'loss' },
    { id: 6, label: "200 EC", value: 200, color: "#121212", weight: 1.99, tier: 'epic' },
    { id: 7, label: "VOID", value: 0, color: "#000000", weight: 40, tier: 'loss' },
];

const Earn = ({ onNavigate: globalNavigate }: { onNavigate?: (tab: string) => void }) => {
    const { initData } = useTelegram();
    const [view, setView] = useState<'main' | 'cpa' | 'spin' | 'ads'>('main');
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setIsPremium(data.dashboard.isPremium);
                }
            } catch (error) {
                console.error('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        const fetchOffers = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/cpa/offers`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) setOffers(data.offers);
            } catch (e) { }
        };

        if (initData) {
            fetchUserData();
            fetchOffers();
        }
    }, [initData]);

    const renderView = () => {
        switch (view) {
            case 'spin': return <SpinWheelView isPremium={isPremium} onBack={() => setView('main')} />;
            case 'ads': return <AdsStreamView onBack={() => setView('main')} />;
            case 'cpa': return <CpaOffersView offers={offers} loading={loading} onBack={() => setView('main')} />;
            default: return <MainEarnGrid onNavigate={setView} onGlobalNavigate={globalNavigate} isPremium={isPremium} />;
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

const MainEarnGrid = ({ onNavigate, onGlobalNavigate, isPremium }: any) => {
    const { webApp } = useTelegram();
    return (
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
                    onClick={() => { webApp?.HapticFeedback.impactOccurred('light'); onNavigate('cpa'); }}
                />
                <EarningGridCard
                    icon={<Play size={24} />}
                    title="Ad Stream"
                    reward="20 EC/unit"
                    color="#FFFFFF"
                    onClick={() => { webApp?.HapticFeedback.impactOccurred('light'); onNavigate('ads'); }}
                />
                <EarningGridCard
                    icon={<RefreshCcw size={24} />}
                    title="The Wheel"
                    reward="Win 1K EC"
                    color="#B2FF41"
                    onClick={() => { webApp?.HapticFeedback.impactOccurred('light'); onNavigate('spin'); }}
                    isSpecial
                />
                <EarningGridCard
                    icon={<Share2 size={24} />}
                    title="Social Nexus"
                    reward="100 EC/task"
                    color="#FFFFFF"
                    onClick={() => { webApp?.HapticFeedback.impactOccurred('light'); onGlobalNavigate('social'); }}
                />
            </div>

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
                        <button onClick={() => { webApp?.HapticFeedback.impactOccurred('medium'); onGlobalNavigate('premium'); }} className="bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl whitespace-nowrap">
                            Unlock
                        </button>
                    </div>
                </section>
            )}
        </motion.div>
    );
};

const EarningGridCard = ({ icon, title, reward, onClick, isSpecial }: any) => (
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
    const [, setDailyEarnings] = useState(0);
    const [, setDailySpins] = useState(0);
    const [spinCharges, setSpinCharges] = useState(0);
    const [adUnlocking, setAdUnlocking] = useState(false);
    const { webApp, initData } = useTelegram();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await res.json();
                if (data.success) {
                    setDailyEarnings(data.dashboard.dailyEarnings || 0);
                    setDailySpins(data.dashboard.referralStats.activeReferrals || 0); // Using this as proxy for now or actual counter
                }
            } catch (e) { }
        };
        if (initData) fetchStats();
    }, [initData]);

    const triggerWinEffects = (reward: any) => {
        if (!reward || reward.value <= 0) return;

        if (reward.tier === 'legendary') {
            // Massive Jackpot Confetti
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#B2FF41', '#FFFFFF', '#FFD700'] });
            }, 250);
        } else if (reward.tier === 'epic') {
            // Burst circles
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#B2FF41', '#FFFFFF']
            });
        } else {
            // Simple spray
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#B2FF41']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#B2FF41']
            });
        }
    };

    const selectReward = () => {
        const currentRewards = isPremium ? REWARDS.filter(r => r.tier !== 'loss') : REWARDS;
        const totalWeight = currentRewards.reduce((acc, r) => acc + r.weight, 0);
        const roll = Math.random() * totalWeight;
        let cumulative = 0;
        for (const reward of currentRewards) {
            cumulative += reward.weight;
            if (roll <= cumulative) return reward;
        }
        return currentRewards[0];
    };

    const spin = async () => {
        if (spinning || spinCharges <= 0) return;

        webApp?.HapticFeedback.impactOccurred('heavy');
        setSpinning(true);
        setResult(null);

        const selection = selectReward();
        const sectionDeg = 360 / REWARDS.length;
        // Find rotation to land on section (The wheel index is fixed to REWARDS array)
        const targetDeg = (REWARDS.length - selection.id) * sectionDeg;
        const extraSpins = 1800 + (Math.floor(Math.random() * 5) * 360);
        const finalDeg = rotation + extraSpins + (targetDeg - (rotation % 360));

        setRotation(finalDeg);

        setTimeout(async () => {
            setSpinning(false);
            setResult(selection);
            setSpinCharges(prev => prev - 1);

            triggerWinEffects(selection);

            if (selection.value > 0) {
                try {
                    await fetch(`${config.apiBaseUrl}/user/complete-ad`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${initData}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount: selection.value, category: 'spin_reward' })
                    });
                } catch (e) { }
            }
        }, 5000);
    };

    const watchAdToUnlock = async () => {
        webApp?.HapticFeedback.impactOccurred('medium');
        setAdUnlocking(true);
        setTimeout(async () => {
            try {
                const res = await fetch(`${config.apiBaseUrl}/user/grant-spin`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSpinCharges(prev => prev + 1);
                    setDailySpins(prev => prev + 1);
                    webApp?.HapticFeedback.notificationOccurred('success');
                } else {
                    webApp?.showAlert(data.message);
                }
            } catch (e) {
                webApp?.showAlert("Nexus Link Interrupted.");
            } finally {
                setAdUnlocking(false);
            }
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
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41]">Spin Node</h3>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">Authorized Randomization</p>
                </div>
                <div className="bg-[#121212] px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                    <RefreshCcw size={14} className={`${spinning ? 'animate-spin' : ''} text-[#B2FF41]`} />
                    <span className="text-xs font-black italic">{spinCharges}</span>
                </div>
            </header>

            <div className="w-full mb-8 relative">
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${isPremium ? 'bg-[#B2FF41]/10 border-[#B2FF41]/20' : 'bg-[#121212] border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <Crown size={20} className={isPremium ? 'text-[#B2FF41]' : 'text-white/10'} />
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-[#B2FF41]' : 'text-white/40'}`}>
                                {isPremium ? "ULTRA NODE ACTIVE" : "STANDARD NODE"}
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-0.5">
                                {isPremium ? "VOID OUTCOMES ELIMINATED" : "Upgrade to eliminate VOID probability"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mb-14">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 z-40 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#B2FF41] filter drop-shadow-[0_0_15px_#B2FF41]" />
                </div>

                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 5, ease: [0.15, 0.85, 0.25, 1] }}
                    className="w-[340px] h-[340px] rounded-full border-[12px] border-[#1A1A1A] bg-[#050505] shadow-[0_0_120px_rgba(178,255,65,0.08)] relative overflow-hidden"
                >
                    <svg className="w-full h-full rotate-[0deg]" viewBox="0 0 100 100">
                        {REWARDS.map((reward, i) => {
                            const angle = 360 / REWARDS.length;
                            const startAngle = i * angle - (angle / 2);
                            const endAngle = (i + 1) * angle - (angle / 2);
                            const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
                            let fillColor = i % 2 === 0 ? '#0D0D0D' : '#141414';
                            if (reward.tier === 'legendary') fillColor = '#1A3300';
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

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#050505] border-[6px] border-[#1A1A1A] flex items-center justify-center z-10 shadow-2xl">
                            <Sparkles size={24} className="text-[#B2FF41] opacity-60" />
                        </div>
                    </div>
                </motion.div>
            </div>

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
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{formatCurrency(result.value).ngn}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <AlertTriangle size={32} className="mx-auto text-white/20" />
                                    <h2 className="text-3xl font-black italic text-white/30 uppercase tracking-tighter">VOID OUTCOME</h2>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/10 italic">Upgrade node to eliminate loss</p>
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
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Randomizing Node</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <Coins size={32} className="mx-auto text-white/5" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Deposit charge to spin</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full space-y-4">
                {spinCharges > 0 ? (
                    <button
                        onClick={spin}
                        disabled={spinning}
                        className="accent-btn w-full h-20 text-xl tracking-[0.3em] uppercase italic relative group"
                    >
                        {spinning ? "Processing..." : "Authorize Node"}
                    </button>
                ) : (
                    <button
                        onClick={watchAdToUnlock}
                        disabled={adUnlocking}
                        className="w-full h-20 rounded-[2.5rem] bg-white text-black flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl"
                    >
                        <Play size={24} fill="black" />
                        <div className="text-left">
                            <p className="text-lg font-black uppercase tracking-tight italic leading-none truncate">
                                {adUnlocking ? "Buffering..." : "Unlock Spin Charge"}
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Watch stream to authorize</p>
                        </div>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const AdsStreamView = ({ onBack }: any) => {
    const { webApp, initData } = useTelegram();
    const [loading, setLoading] = useState(false);

    const handleAdWatch = async () => {
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/complete-ad`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${initData}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 5, category: 'ad_reward' })
                });
                const data = await response.json();
                if (data.success) {
                    webApp?.HapticFeedback.notificationOccurred('success');
                    webApp?.showAlert(`Authorized: 5 EC Transferred to Vault.`);
                }
            } catch (error) { } finally { setLoading(false); }
        }, 10000);
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
                    <History size={20} />
                </button>
                <h3 className="text-sm font-black uppercase tracking-[0.3em] italic">Stream Matrix</h3>
            </header>

            <div className="premium-card p-12 bg-[#0A0A0A] text-center">
                <div className="w-24 h-24 rounded-[3rem] bg-[#B2FF41]/10 flex items-center justify-center mx-auto mb-10">
                    {loading ? <Loader2 size={40} className="text-[#B2FF41] animate-spin" /> : <Play size={40} className="text-[#B2FF41] fill-[#B2FF41]" />}
                </div>
                <h2 className="text-2xl font-black italic mb-4 uppercase">{loading ? 'Verifying' : 'Initialize'}</h2>
                <button
                    onClick={handleAdWatch}
                    disabled={loading}
                    className="accent-btn w-full"
                >
                    {loading ? 'STREAMING...' : 'Start Stream'}
                </button>
            </div>
        </motion.div>
    );
};

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
            <h3 className="text-sm font-black uppercase tracking-[0.3em] italic">Alpha Nodes</h3>
        </header>

        <div className="space-y-4">
            {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-28 bg-[#121212] rounded-[2.5rem] animate-pulse" />)
            ) : (
                offers.map((offer: any) => (
                    <div key={offer.id} className="premium-card p-6 bg-[#121212] flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#050505]">
                                <img src={offer.imageUrl || offer.image_url} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm tracking-tight">{offer.title}</h4>
                                <p className="text-[#B2FF41] text-[11px] font-black italic">{offer.reward} EC</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(offer.link, '_blank')}
                            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                ))
            )}
        </div>
    </motion.div>
);

export default Earn;
