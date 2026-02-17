import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Instagram,
    MessageCircle,
    Share2,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const OrderFollowers = ({ onBack }: { onBack: () => void }) => {
    const { webApp, initData } = useTelegram();
    const [platform, setPlatform] = useState<'telegram' | 'instagram' | 'x'>('telegram');
    const [quantity, setQuantity] = useState('100');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [targetAccount, setTargetAccount] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setBalance(data.dashboard.balance);
                }
            } catch (error) {
                console.error('Failed to fetch balance');
            }
        };
        if (initData) fetchBalance();
    }, [initData]);

    const platforms = [
        { id: 'telegram', icon: <MessageCircle size={20} />, name: 'Telegram', color: '#0088cc' },
        { id: 'instagram', icon: <Instagram size={20} />, name: 'Instagram', color: '#E1306C' },
        { id: 'x', icon: <Share2 size={20} />, name: 'X / Twitter', color: '#FFFFFF' },
    ];

    // Pricing Protocol (Adjusted to EC and Stars)
    const pricePerFollowerEC = 5;
    const pricePerFollowerStars = 2.5;

    const totalEC = Math.floor(parseInt(quantity || '0') * pricePerFollowerEC);
    const totalStars = Math.floor(parseInt(quantity || '0') * pricePerFollowerStars);

    const handleBalanceOrder = async () => {
        if (!link || !quantity) return webApp?.showAlert("Vector fields uninitialized.");
        if (balance < totalEC) return webApp?.showAlert(`Insufficient Liquidity. Need ${totalEC} EC.`);

        webApp?.showConfirm(`Authorize Balance Payout?\n\nAmount: ${totalEC} EC\nQuantity: ${quantity} Followers`, async (ok: boolean) => {
            if (!ok) return;
            setLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/social/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${initData}`
                    },
                    body: JSON.stringify({
                        platform,
                        quantity,
                        link,
                        paymentMethod: 'balance'
                    })
                });

                if (response.ok) {
                    webApp.HapticFeedback.notificationOccurred('success');
                    webApp.showAlert("Order Authorized via Balance. Deployment starting...");
                    onBack();
                } else {
                    webApp.showAlert("Protocol Error: Order rejected.");
                }
            } catch (error) {
                webApp.showAlert("Connectivity Error.");
            } finally {
                setLoading(false);
            }
        });
    };

    const handleStarsOrder = async () => {
        if (!link || !quantity) return webApp?.showAlert("Vector fields uninitialized.");
        setLoading(true);
        try {
            const res = await fetch(`${config.apiBaseUrl}/payments/create-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${initData}`
                },
                body: JSON.stringify({
                    title: `${quantity} ${platform.toUpperCase()} Followers`,
                    description: `Deployment Link: ${link}`,
                    amount: totalStars,
                    payload: {
                        userId: webApp?.initDataUnsafe.user?.id,
                        type: 'ORDER_FOLLOWERS',
                        platform,
                        quantity,
                        link
                    }
                })
            });
            const data = await res.json();
            if (data.success && data.invoiceLink) {
                webApp?.openInvoice(data.invoiceLink, (status: string) => {
                    setLoading(false);
                    if (status === 'paid') {
                        webApp?.HapticFeedback.notificationOccurred('success');
                        webApp?.showAlert("Stars Payment Confirmed. Order deployed.");
                        onBack();
                    }
                });
            } else {
                setLoading(false);
                webApp?.showAlert("Invoice Generation Failed.");
            }
        } catch (e) {
            setLoading(false);
            webApp?.showAlert("Network Error.");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] italic text-[#B2FF41]">Growth Terminal</h3>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Scalable Audience Distribution</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Balance</p>
                        <p className="text-sm font-black text-[#B2FF41] italic">{balance.toLocaleString()} EC</p>
                    </div>
                </header>

                <div className="space-y-8">
                    {/* Platform Selector */}
                    <div className="space-y-4">
                        <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-2 italic">Select Relay Node</label>
                        <div className="grid grid-cols-3 gap-3">
                            {platforms.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPlatform(p.id as any)}
                                    className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${platform === p.id
                                        ? 'bg-[#121212] border-[#B2FF41] shadow-[0_0_20px_rgba(178,255,65,0.1)]'
                                        : 'bg-[#0A0A0A] border-white/5 opacity-40'
                                        }`}
                                >
                                    <div style={{ color: p.color }}>{p.icon}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="premium-card p-8 bg-[#0A0A0A] space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-2 italic">Target Account/Channel Name</label>
                            <input
                                type="text"
                                value={targetAccount}
                                onChange={(e) => setTargetAccount(e.target.value)}
                                placeholder="Your Brand / Channel Name"
                                className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-[#B2FF41] focus:outline-none focus:border-[#B2FF41]/40 transition-all placeholder:text-white/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-2 italic">Destination Link</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="e.g. t.me/link or channel link"
                                className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-white/60 focus:outline-none focus:border-[#B2FF41]/40 transition-all placeholder:text-white/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-2 italic">Quantity (Min 100)</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="100"
                                className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-white/60 focus:outline-none focus:border-[#B2FF41]/40 transition-all placeholder:text-white/5"
                            />
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="premium-card p-6 bg-[#0D0D0D] border-white/5 border-l-2 border-l-[#B2FF41]">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Balance Cost</p>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black italic">{totalEC.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-[#B2FF41] mb-1">EC</span>
                            </div>
                        </div>
                        <div className="premium-card p-6 bg-[#0D0D0D] border-white/5 border-l-2 border-l-yellow-500">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Stars Cost</p>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black italic">{totalStars.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-yellow-500 mb-1">STARS</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleBalanceOrder}
                            disabled={loading}
                            className={`w-full h-20 rounded-[1.5rem] bg-white text-black text-xs font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-4 ${loading ? 'opacity-50' : ''}`}
                        >
                            <span>Deploy with Balance</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41]" />
                        </button>

                        <button
                            onClick={handleStarsOrder}
                            disabled={loading}
                            className={`w-full h-20 rounded-[1.5rem] bg-[#B2FF41] text-black text-xs font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-4 ${loading ? 'opacity-50' : ''}`}
                        >
                            <span>Quick Pay with Stars</span>
                            <ArrowRight size={18} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex justify-center items-center gap-3 opacity-20">
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Deployment Protocol</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderFollowers;
