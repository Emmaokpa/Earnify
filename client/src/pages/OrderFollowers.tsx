import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Instagram,
    MessageCircle,
    Share2,
    ShieldCheck,
    Zap,
    Users,
    CreditCard,
    ArrowRight,
    Trophy
} from 'lucide-react';
import { useState } from 'react';
import useTelegram from '../hooks/useTelegram';
import { formatCurrency } from './Earn';

const OrderFollowers = ({ onBack }: { onBack: () => void }) => {
    const { webApp } = useTelegram();
    const [platform, setPlatform] = useState<'telegram' | 'instagram' | 'x'>('telegram');
    const [quantity, setQuantity] = useState('100');
    const [link, setLink] = useState('');

    const platforms = [
        { id: 'telegram', icon: <MessageCircle size={20} />, name: 'Telegram', color: '#0088cc' },
        { id: 'instagram', icon: <Instagram size={20} />, name: 'Instagram', color: '#E1306C' },
        { id: 'x', icon: <Share2 size={20} />, name: 'X / Twitter', color: '#FFFFFF' },
    ];

    const pricePerFollower = 50; // 50 Naira
    const totalPrice = parseInt(quantity || '0') * pricePerFollower;

    const handleOrder = () => {
        if (!link || !quantity) {
            webApp?.showAlert("All vector fields must be initialized.");
            return;
        }

        webApp?.showConfirm(`Authorize Campaign Initialization?\n\nPlatform: ${platform.toUpperCase()}\nQuantity: ${quantity}\nTotal: ₦${totalPrice.toLocaleString()}`, (ok) => {
            if (ok) {
                webApp.HapticFeedback.notificationOccurred('success');
                webApp.showAlert("Order transmitted to operations. Deployment starts within 2 hours.");
                onBack();
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10"
            >
                <header className="flex items-center gap-6 mb-12">
                    <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-[#121212] border border-white/5 flex items-center justify-center">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] italic text-[#B2FF41]">Growth Terminal</h3>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Scalable Audience Distribution</p>
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
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-2 italic">Destination URL / Username</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="e.g. @username or t.me/link"
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

                    {/* Summary Card */}
                    <div className="premium-card p-8 bg-gradient-to-br from-[#121212] to-black border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Campaign Liquidity</p>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-[#B2FF41]">₦{totalPrice.toLocaleString()}</h2>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]">
                                <Trophy size={24} />
                            </div>
                        </div>

                        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/[0.03] space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/20">Unit Cost</span>
                                <span>₦50.00 / Node</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/20">Authorized Nodes</span>
                                <span>{quantity} Users</span>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleOrder}
                        className="accent-btn w-full h-20 text-lg tracking-[0.3em] italic uppercase shadow-[0_15px_40px_rgba(178,255,65,0.2)]"
                    >
                        Deploy Audience <ArrowRight size={20} strokeWidth={3} />
                    </button>

                    <div className="flex justify-center items-center gap-3 opacity-20">
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Order Transmission</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderFollowers;
