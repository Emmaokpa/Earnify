import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Building2,
    ShieldCheck,
    History,
    Info,
    Zap,
    Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Withdraw = () => {
    const { initData } = useTelegram();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
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
                    setTransactions(data.dashboard.recentTransactions || []);
                }
            } catch (error) {
                console.error('Failed to fetch balance');
            }
        };
        if (initData) fetchBalance();
    }, [initData]);

    const getTxIcon = (category: string, type: string) => {
        if (type === 'debit') return <ArrowRight size={14} className="-rotate-45" />;
        if (category === 'ad_reward') return <Zap size={14} />;
        if (category === 'referral_bonus') return <Users size={14} />;
        return <Wallet size={14} />;
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) < 500) {
            alert('Minimum withdrawal is ₦500');
            return;
        }
        if (Number(amount) > balance) {
            alert('Insufficient balance');
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
                    amount: Number(amount),
                    bank,
                    accountNumber
                })
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                // Refresh balance
                const res = await fetch(`${config.apiBaseUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const d = await res.json();
                if (d.success) setBalance(d.dashboard.balance);
            } else {
                alert(data.message || 'Withdrawal failed');
            }
        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-10 text-center max-w-sm w-full"
                >
                    <div className="w-20 h-20 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,255,136,0.1)]">
                        <CheckCircle2 size={44} className="text-[#00FF88]" />
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tighter mb-4 uppercase">Request Sent</h2>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-loose mb-10">
                        Your withdrawal of <span className="text-white">₦{Number(amount).toLocaleString()}</span> has been queued for verification. Settlement usually takes 1-6 hours.
                    </p>
                    <button
                        onClick={() => { setSuccess(false); setAmount(''); }}
                        className="btn-sleek-primary w-full py-4 uppercase font-black tracking-widest"
                    >
                        Acknowledge
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32">
            <div className="mesh-gradient" />

            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10 flex justify-between items-end"
            >
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2">WALLET</h1>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Secure Liquidity Management</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <History size={18} className="text-white/40" />
                </button>
            </motion.header>

            {/* Balance Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card-bright p-8 mb-10 relative overflow-hidden group"
            >
                <Wallet size={120} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Available for payout</p>
                <h2 className="text-5xl font-black italic racking-tighter mb-6">₦{balance.toLocaleString()}</h2>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
                    <ShieldCheck size={12} className="text-[#00FF88]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Verified Liquidity</span>
                </div>
            </motion.div>

            {/* Withdrawal Form */}
            <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onSubmit={handleWithdraw}
                className="space-y-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">Payout Terminal</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Select Bank"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 focus:bg-white/[0.08] transition-all"
                        />
                        <Building2 size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00FF88] transition-colors" />
                    </div>

                    <div className="relative group">
                        <input
                            type="number"
                            placeholder="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 focus:bg-white/[0.08] transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <input
                            type="number"
                            placeholder="Amount (min ₦500)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 focus:bg-white/[0.08] transition-all"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setAmount(balance.toString())}
                                className="text-[9px] font-black uppercase tracking-widest bg-[#00FF88]/10 text-[#00FF88] px-2 py-1 rounded-md border border-[#00FF88]/20"
                            >
                                Max
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-orange-400 shrink-0" />
                    <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider leading-relaxed">
                        Ensure account details match your registered identity to avoid payout delays.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="btn-sleek-primary w-full py-6 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 text-black shadow-[0_20px_40px_-15px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:grayscale transition-all"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Initialize Payout
                            <ArrowRight size={20} />
                        </>
                    )}
                </motion.button>
            </motion.form>

            {/* Transaction History Section */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-12"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">History</h2>
                        <div className="h-[1px] w-12 bg-white/10" />
                    </div>
                </div>

                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <div className="text-center py-10 opacity-20 text-[10px] font-black uppercase tracking-[0.2em]">
                            No Transactions Found
                        </div>
                    ) : (
                        transactions.map((tx: any) => (
                            <div key={tx.id} className="glass-card !rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'debit' ? 'bg-red-500/10 text-red-400' : 'bg-[#00FF88]/10 text-[#00FF88]'
                                        }`}>
                                        {getTxIcon(tx.category, tx.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[13px] tracking-tight capitalize">{tx.category?.replace('_', ' ') || tx.type}</h4>
                                        <p className="text-[10px] text-white/30 font-medium">
                                            {tx.createdAt?._seconds ? new Date(tx.createdAt._seconds * 1000).toLocaleDateString() : new Date(tx.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-sm ${tx.type === 'debit' ? 'text-white' : 'text-[#00FF88]'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                                    </p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${tx.status === 'pending' ? 'text-orange-400' : 'text-white/20'
                                        }`}>
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.section>
        </div>
    );
};

export default Withdraw;
