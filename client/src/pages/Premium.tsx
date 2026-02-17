import { motion } from 'framer-motion';
import {
    Crown,
    ShieldCheck,
    ZapOff,
    TrendingUp,
    Star,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Premium = () => {
    const { webApp, initData } = useTelegram();
    const [loading, setLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    const handleStarsPayment = async () => {
        if (!webApp || !initData) return;
        webApp.HapticFeedback.impactOccurred('medium');
        setLoading(true);
        try {
            const res = await fetch(`${config.apiBaseUrl}/payments/create-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${initData}`
                },
                body: JSON.stringify({
                    title: 'Ultra Node VIP',
                    description: 'Lifetime Premium Access',
                    amount: 250,
                    payload: { userId: webApp.initDataUnsafe.user?.id, type: 'VIP' }
                })
            });

            const data = await res.json();

            if (data.success && data.invoiceLink) {
                webApp.openInvoice(data.invoiceLink, (status: string) => {
                    setLoading(false);
                    if (status === 'paid') {
                        webApp.HapticFeedback.notificationOccurred('success');
                        setShowReceipt(true);
                    }
                });
            } else {
                setLoading(false);
                webApp.showAlert('Invoice generation failed');
            }
        } catch (e) {
            setLoading(false);
            webApp.showAlert('Connection error');
        }
    };

    if (showReceipt) return <ReceiptView onFinish={() => window.location.reload()} />;

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
            >
                <header className="mb-14 text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#B2FF41]/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(178,255,65,0.2)]">
                        <Crown size={40} className="text-[#B2FF41]" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Ultra <span className="text-[#B2FF41]">Node</span></h1>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] italic">The Final Accumulation Tier</p>
                </header>

                {/* Benefits Grid */}
                <div className="space-y-4 mb-14">
                    <BenefitCard
                        icon={<ZapOff size={20} />}
                        title="ZERO WAIT / VOID"
                        desc="Eliminate loss sectors from Dynamic Vault (Wheel)."
                        color="#B2FF41"
                    />
                    <BenefitCard
                        icon={<TrendingUp size={20} />}
                        title="2X REVENUE NODES"
                        desc="Double your referral yield for every active connection."
                        color="#FFFFFF"
                    />
                    <BenefitCard
                        icon={<ShieldCheck size={20} />}
                        title="INSTANT PAYOUTS"
                        desc="Bypass the 24h cooldown for local bank relays."
                        color="#B2FF41"
                    />
                    <BenefitCard
                        icon={<Sparkles size={20} />}
                        title="EXCLUSIVE ARCADE"
                        desc="Access high-yield games with 5 EC / 2 Min payout."
                        color="#FFFFFF"
                    />
                </div>

                {/* Checkout Module */}
                <div className="premium-card p-10 bg-gradient-to-br from-[#121212] to-black border-white/[0.05] relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 text-white/5">
                        <Star size={120} strokeWidth={1} />
                    </div>

                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Lifetime Access</p>
                            <h3 className="text-4xl font-black italic tracking-tighter uppercase">$5.00 <span className="text-sm text-[#B2FF41]/40 text-normal font-bold">USD</span></h3>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-[#B2FF41] mb-1">
                                <Star size={16} fill="#B2FF41" />
                                <span className="text-xl font-black italic">250</span>
                            </div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Digital Stars</p>
                        </div>
                    </div>

                    <button
                        onClick={handleStarsPayment}
                        disabled={loading}
                        className="accent-btn w-full h-20 text-lg uppercase tracking-[0.2em] italic group relative"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <Sparkles size={20} />
                                </motion.div>
                                <span>INITIALIZING...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span>ACTIVATE PROTOCOL</span>
                                <ArrowUpRight size={24} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        )}
                    </button>

                    <p className="text-[8px] text-center text-white/10 font-bold uppercase tracking-[0.4em] mt-8">
                        Authorized via Telegram Secure Gateway
                    </p>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6 opacity-20 group grayscale">
                    <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" className="w-6 h-6 object-contain" alt="ton" />
                    <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" className="w-6 h-6 object-contain" alt="usdt" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Crypto Coming Soon</p>
                </div>
            </motion.div>
        </div>
    );
};

const ReceiptView = ({ onFinish }: { onFinish: () => void }) => (
    <div className="min-h-screen bg-[#050505] text-white px-6 flex items-center justify-center relative font-jakarta">
        <div className="gradient-aura" />
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full premium-card p-10 bg-white text-black relative"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black rounded-full flex items-center justify-center border-8 border-[#050505]">
                <ShieldCheck size={40} className="text-[#B2FF41]" />
            </div>

            <div className="text-center mt-6 mb-10">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-black/40 mb-2">Protocol Certified</h2>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">ULTRA NODE ACTIVE</h1>
            </div>

            <div className="space-y-6 border-y-2 border-dashed border-black/10 py-8 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-black/40">Status</span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#B2FF41] bg-black px-3 py-1 rounded-lg">VERIFIED</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-black/40">Asset Code</span>
                    <span className="text-xs font-black uppercase tracking-tight italic">EARN-VIP-{Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-black/40">Network Duration</span>
                    <span className="text-xs font-black uppercase tracking-tight italic">LIFETIME ACCESS</span>
                </div>
            </div>

            <button
                onClick={onFinish}
                className="w-full h-16 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
                Enter Node
            </button>
            <p className="text-[8px] text-center text-black/30 font-bold uppercase tracking-widest mt-6 italic">Secure Ledger Sync Complete</p>
        </motion.div>
    </div>
);

const BenefitCard = ({ icon, title, desc, color }: any) => (
    <div className="premium-card p-6 flex items-start gap-5 bg-[#0D0D0D]/50 border-white/[0.03]">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black border border-white/5" style={{ color: color }}>
            {icon}
        </div>
        <div>
            <h4 className="text-[12px] font-black uppercase tracking-tight italic" style={{ color }}>{title}</h4>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed mt-1">{desc}</p>
        </div>
    </div>
);

export default Premium;
