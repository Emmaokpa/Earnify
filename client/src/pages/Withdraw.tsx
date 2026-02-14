import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    MoreHorizontal,
    Wallet,
    Info,
    ArrowRight,
    CheckCircle2,
    X,
    Building2,
    CreditCard,
    ArrowUpRight,
    ShieldCheck,
    History,
    AlertCircle,
    Banknote,
    Lock,
    Coins,
    DollarSign
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';
import { formatCurrency } from './Earn';

const Withdraw = () => {
    const { initData } = useTelegram();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [bank, setBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleWithdraw = async () => {
        const amountNum = Number(amount);
        // 50 EC = 5000 NGN (if 1 EC = 100 NGN? Wait, user said 1 EC = 10 NGN)
        // 50 EC = 500 NGN.
        if (!amount || amountNum < 50) {
            alert('Minimum withdrawal is 50 EC (₦500)');
            return;
        }
        if (amountNum > balance) {
            alert('Insufficient unit liquidity');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/withdraw`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amountNum,
                    bank,
                    accountNumber
                })
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(true);
            } else {
                alert(data.message || 'Transmission failed');
            }
        } catch (error) {
            alert('Gateway synchronization error');
        } finally {
            setLoading(false);
        }
    };

    const currency = formatCurrency(balance);
    const inputCurrency = formatCurrency(Number(amount) || 0);

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 overflow-hidden">
                <div className="gradient-aura" />
                <motion.div
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="premium-card p-12 text-center w-full max-w-sm bg-gradient-to-br from-[#121212] to-black border-white/5"
                >
                    <div className="w-24 h-24 rounded-full bg-[#B2FF41]/10 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(178,255,65,0.2)]">
                        <CheckCircle2 size={48} className="text-[#B2FF41] animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">SUCCESSFUL</h2>
                    <p className="text-white/40 text-[12px] font-bold mb-12 leading-relaxed uppercase tracking-widest italic">
                        Node payout protocol initiated. <span className="text-[#B2FF41]">{Number(amount)} EC</span> ({inputCurrency.ngn}) is being routed to your local banking node.
                    </p>
                    <button
                        onClick={() => { setSuccess(false); setAmount(''); }}
                        className="accent-btn w-full text-lg shadow-[0_15px_40px_rgba(178,255,65,0.4)] uppercase italic tracking-widest"
                    >
                        Optimize Node
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <header className="flex justify-between items-center mb-14 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-[2.5px] bg-[#B2FF41]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Treasury Portal</span>
                </div>
                <div className="bg-[#121212] px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#B2FF41]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">256-Bit SSL</span>
                </div>
            </header>

            <div className="space-y-8 relative z-10">
                {/* Visual Balance Cluster */}
                <div className="premium-card p-10 bg-gradient-to-br from-[#121212] to-black overflow-hidden relative">
                    <div className="shimmer" />
                    <div className="absolute -top-1 -right-1 w-24 h-24 bg-[#B2FF41]/5 blur-3xl" />
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Available Liquidity</p>
                            <h1 className="text-6xl font-black tracking-tighter italic">{currency.ec.toLocaleString()} <span className="text-2xl text-[#B2FF41]">EC</span></h1>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 pt-1">
                            <span className="text-[11px] font-black text-[#B2FF41] uppercase tracking-widest">{currency.ngn}</span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{currency.usd}</span>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#B2FF41] to-transparent"
                        />
                    </div>
                </div>

                {/* Transfer Configuration Form */}
                <div className="premium-card p-8 bg-[#0A0A0A] border-white/[0.05] space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse shadow-[0_0_10px_#B2FF41]" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Payout Config</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-5">
                                <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] italic">Transfer Units (EC)</label>
                                {amount && (
                                    <span className="text-[9px] font-black text-[#B2FF41] uppercase tracking-widest italic animate-pulse">
                                        Value: {inputCurrency.ngn}
                                    </span>
                                )}
                            </div>
                            <div className="relative group">
                                <Coins className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Min 50"
                                    className="withdraw-input pl-16 text-2xl h-24"
                                />
                            </div>
                        </div>

                        {/* Bank Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-5 italic">Relay Bank</label>
                            <div className="relative">
                                <Building2 className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                                <input
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    placeholder="Opay / Kuda / Moniepoint"
                                    className="withdraw-input pl-16"
                                />
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] ml-5 italic">Node Serial Number (A/C)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-7 top-1/2 -translate-y-1/2 text-white/10" size={20} />
                                <input
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="0123456789"
                                    className="withdraw-input pl-16 font-mono tracking-[0.2em]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleWithdraw}
                    disabled={loading || !amount || !bank || !accountNumber}
                    className={`accent-btn w-full h-24 text-xl tracking-[0.3em] italic uppercase mt-4 transition-all ${(!amount || !bank || !accountNumber) ? 'opacity-30 grayscale pointer-events-none' : ''
                        }`}
                >
                    {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <History size={24} />
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span>Relay Funds</span>
                            <ArrowUpRight size={24} strokeWidth={3} />
                        </div>
                    )}
                </button>
            </div>

            <style>{`
                .withdraw-input {
                    width: 100%;
                    background: #050505;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 2.2rem;
                    padding: 1.5rem 1.75rem;
                    font-weight: 900;
                    font-style: italic;
                    color: white;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .withdraw-input:focus {
                    outline: none;
                    border-color: #B2FF41;
                    background: #080808;
                    box-shadow: 0 0 30px rgba(178, 255, 65, 0.1);
                }
                .withdraw-input::placeholder {
                    color: rgba(255,255,255,0.05);
                    font-weight: 800;
                }
            `}</style>
        </div>
    );
};

export default Withdraw;
