import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Database,
    Share2,
    Wallet,
    TrendingUp,
    Users,
    DollarSign,
    Upload,
    Bell,
    CheckCircle,
    XCircle
} from 'lucide-react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Admin = () => {
    const { initData, webApp } = useTelegram();
    const [activeTab, setActiveTab] = useState<'stats' | 'cpa' | 'games' | 'social' | 'finance' | 'broadcast'>('stats');
    const [stats, setStats] = useState<any>(null);

    const [, setCpaNodes] = useState<any[]>([]);
    const [, setGames] = useState<any[]>([]);
    const [, setSocialTasks] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);

    const [newCpa, setNewCpa] = useState({
        title: '', reward: '', category: 'Survey', imageUrl: '', link: '',
        isPremiumOnly: false, requiresScreenshot: false
    });
    const [newGame, setNewGame] = useState({ title: '', iframeUrl: '', imageUrl: '', category: 'Arcade' });
    const [broadcastMsg, setBroadcastMsg] = useState('');

    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        if (!initData) return;
        try {
            const [statsRes, cpaRes, gameRes, socialRes, financeRes] = await Promise.all([
                fetch(`${config.apiBaseUrl}/admin/stats`, { headers: { 'Authorization': `Bearer ${initData}` } }),
                fetch(`${config.apiBaseUrl}/cpa/offers`, { headers: { 'Authorization': `Bearer ${initData}` } }),
                fetch(`${config.apiBaseUrl}/games/list`, { headers: { 'Authorization': `Bearer ${initData}` } }),
                fetch(`${config.apiBaseUrl}/social/list`, { headers: { 'Authorization': `Bearer ${initData}` } }),
                fetch(`${config.apiBaseUrl}/admin/withdrawals`, { headers: { 'Authorization': `Bearer ${initData}` } })
            ]);

            const statsData = await statsRes.json();
            const cpaData = await cpaRes.json();
            const gameData = await gameRes.json();
            const socialData = await socialRes.json();
            const financeData = await financeRes.json();

            if (statsData.success) setStats(statsData.stats);
            if (cpaData.success) setCpaNodes(cpaData.offers || []);
            if (gameData.success) setGames(gameData.games || []);
            if (socialData.success) setSocialTasks(socialData.tasks || []);
            if (financeData.success) setWithdrawals(financeData.withdrawals || []);
        } catch (error) {
            console.error('Admin fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, [initData]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cpa' | 'game') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${config.apiBaseUrl}/admin/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${initData}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                if (type === 'cpa') setNewCpa({ ...newCpa, imageUrl: data.url });
                else setNewGame({ ...newGame, imageUrl: data.url });
                webApp?.showAlert('Image Uploaded to Protocol.');
            }
        } catch (err) {
            webApp?.showAlert('Upload Sync Failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleApprove = async (id: string, amount: number) => {
        if (!confirm(`Initialize Payout: Deduct ${amount} EC and approve?`)) return;
        try {
            const res = await fetch(`${config.apiBaseUrl}/admin/withdrawals/approve/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchData();
                webApp?.showAlert('Withdrawal Finalized. Bot notified user.');
            } else {
                webApp?.showAlert(data.message);
            }
        } catch (e) {
            webApp?.showAlert('Error in deployment.');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            await fetch(`${config.apiBaseUrl}/admin/withdrawals/reject/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${initData}`
                },
                body: JSON.stringify({ reason })
            });
            fetchData();
            webApp?.showAlert('Request Nullified.');
        } catch (e) {
            alert('Error');
        }
    };

    const handleCreateCpa = async () => {
        try {
            const res = await fetch(`${config.apiBaseUrl}/cpa/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${initData}` },
                body: JSON.stringify(newCpa)
            });
            if (res.ok) {
                setNewCpa({ title: '', reward: '', category: 'Survey', imageUrl: '', link: '', isPremiumOnly: false, requiresScreenshot: false });
                webApp?.showAlert('CPA Node Deployed.');
                fetchData();
            }
        } catch (e) { alert('Failed'); }
    };

    const handleBroadcast = async () => {
        if (!broadcastMsg) return;
        try {
            const res = await fetch(`${config.apiBaseUrl}/admin/broadcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${initData}` },
                body: JSON.stringify({ message: broadcastMsg })
            });
            const data = await res.json();
            if (data.success) {
                setBroadcastMsg('');
                webApp?.showAlert(`Broadcast Sent to ${data.count} operatives.`);
            }
        } catch (e) { alert('Broadcast failed'); }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <header className="mb-14 relative z-10 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Operations Hub v2</span>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Protocol <span className="text-[#B2FF41]">Control</span></h1>
                </div>
                <button onClick={fetchData} className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center border border-white/5 hover:border-[#B2FF41]/30 transition-all">
                    <Database size={20} className="text-[#B2FF41]" />
                </button>
            </header>

            {/* Stats Overview */}
            {stats && (
                <section className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                    <StatCard icon={<Users size={16} />} label="Operatives" value={stats.totalUsers} color="#B2FF41" />
                    <StatCard icon={<TrendingUp size={16} />} label="Yield Issued" value={`${stats.totalDistributed} EC`} color="#FFFFFF" />
                    <StatCard icon={<Wallet size={16} />} label="Pending Vault" value={`${stats.pendingVolume} EC`} color="#FFA500" />
                    <StatCard icon={<DollarSign size={16} />} label="Star Revenue" value={stats.revenueStars} color="#00E5FF" />
                </section>
            )}

            <div className="flex gap-2 mb-10 p-1.5 bg-[#121212] rounded-[1.8rem] border border-white/5 relative z-10 overflow-x-auto no-scrollbar">
                <AdminTab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<Database size={14} />}>DASH</AdminTab>
                <AdminTab active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<Wallet size={14} />}>VAULT</AdminTab>
                <AdminTab active={activeTab === 'cpa'} onClick={() => setActiveTab('cpa')} icon={<Zap size={14} />}>CPA</AdminTab>
                <AdminTab active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Share2 size={14} />}>NEXUS</AdminTab>
                <AdminTab active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} icon={<Bell size={14} />}>ALERTS</AdminTab>
            </div>

            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'stats' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="stats" className="space-y-6">
                            <div className="premium-card p-6 bg-[#0A0A0A]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#B2FF41]">Contest Radar (FOMO)</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]"><TrendingUp size={14} /></div>
                                            <span className="text-[10px] font-black uppercase italic text-white/60">Weekly Top Referral Reward</span>
                                        </div>
                                        <span className="text-xs font-black text-[#B2FF41]">500 EC</span>
                                    </div>
                                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest text-center">Minimum threshold: 50 active tasks</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'finance' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="finance">
                            <div className="premium-card p-6 bg-[#0A0A0A] space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] italic text-[#B2FF41]">Payout Queue</h3>
                                {withdrawals.length === 0 && <p className="text-center text-[10px] text-white/20 py-20 font-black uppercase tracking-[0.4em]">Queue Empty</p>}
                                {withdrawals.map((w) => (
                                    <div key={w.id} className="p-5 bg-[#121212] rounded-2xl border border-white/5 space-y-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs font-black text-white uppercase italic">{w.userName || 'Unknown'}</p>
                                                <p className="text-[9px] text-[#B2FF41] font-mono mt-1">{w.bank} • {w.accountNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black italic tracking-tighter">{w.amount} EC</p>
                                                <p className="text-[8px] text-white/10 uppercase font-black">{new Date(w.createdAt?._seconds * 1000).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                            <button onClick={() => handleApprove(w.id, w.amount)} className="h-10 rounded-xl bg-[#B2FF41]/10 text-[#B2FF41] text-[9px] font-black uppercase tracking-widest hover:bg-[#B2FF41]/20 flex items-center justify-center gap-2">
                                                <CheckCircle size={12} /> Approve
                                            </button>
                                            <button onClick={() => handleReject(w.id)} className="h-10 rounded-xl bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 flex items-center justify-center gap-2">
                                                <XCircle size={12} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'cpa' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="cpa" className="space-y-10">
                            <div className="premium-card p-8 bg-[#0A0A0A]">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-[#B2FF41]">New CPA Module</h3>
                                <div className="space-y-4">
                                    <AdminInput placeholder="Node Title" value={newCpa.title} onChange={(v: string) => setNewCpa({ ...newCpa, title: v })} />
                                    <AdminInput placeholder="Direct Link" value={newCpa.link} onChange={(v: string) => setNewCpa({ ...newCpa, link: v })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput placeholder="Reward (EC)" value={newCpa.reward} onChange={(v: string) => setNewCpa({ ...newCpa, reward: v })} />
                                        <select className="bg-[#050505] border border-white/5 rounded-2xl px-4 text-[10px] uppercase font-black tracking-widest text-[#B2FF41]" value={newCpa.category} onChange={(e) => setNewCpa({ ...newCpa, category: e.target.value })}>
                                            <option value="Survey">Survey</option>
                                            <option value="Signup">Signup</option>
                                            <option value="Download">Download</option>
                                            <option value="KYC">KYC</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-4">
                                        <label className="flex-1 h-14 bg-[#121212] rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:border-[#B2FF41]/40 transition-all">
                                            <Upload size={14} className={uploading ? 'animate-bounce text-[#B2FF41]' : 'text-white/20'} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cpa')} />
                                        </label>
                                        {newCpa.imageUrl && <div className="w-14 h-14 rounded-2xl bg-[#121212] p-1 border border-[#B2FF41]/20"><img src={newCpa.imageUrl} className="w-full h-full object-cover rounded-xl" /></div>}
                                    </div>

                                    <div className="flex gap-4 p-4 bg-[#121212] rounded-2xl border border-white/5">
                                        <button onClick={() => setNewCpa({ ...newCpa, isPremiumOnly: !newCpa.isPremiumOnly })} className={`flex-1 py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all ${newCpa.isPremiumOnly ? 'bg-[#B2FF41]/20 border-[#B2FF41] text-[#B2FF41]' : 'bg-transparent border-white/10 text-white/20'}`}>
                                            Premium Only
                                        </button>
                                        <button onClick={() => setNewCpa({ ...newCpa, requiresScreenshot: !newCpa.requiresScreenshot })} className={`flex-1 py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all ${newCpa.requiresScreenshot ? 'bg-[#B2FF41]/20 border-[#B2FF41] text-[#B2FF41]' : 'bg-transparent border-white/10 text-white/20'}`}>
                                            Proof Required
                                        </button>
                                    </div>

                                    <button onClick={handleCreateCpa} className="w-full h-14 bg-[#B2FF41] text-black rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs mt-4">Deploy Node</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'broadcast' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="broadcast">
                            <div className="premium-card p-8 bg-[#0A0A0A] space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#B2FF41] mb-6">Global Dispatch (Bot)</h3>
                                <textarea
                                    className="w-full h-32 bg-[#050505] border border-white/5 rounded-2xl p-6 text-xs text-white/60 focus:outline-none focus:border-[#B2FF41]/20"
                                    placeholder="Enter message for ALL users..."
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                />
                                <button onClick={handleBroadcast} className="w-full h-14 bg-[#121212] border border-[#B2FF41]/30 text-[#B2FF41] rounded-2xl font-black uppercase tracking-widest hover:bg-[#B2FF41]/10 transition-all flex items-center justify-center gap-3">
                                    <Bell size={16} /> Broadcast Alerts
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }: any) => (
    <div className="premium-card p-6 bg-[#0A0A0A] border-l-2" style={{ borderLeftColor: color }}>
        <div className="flex items-center gap-3 mb-3 text-white/20">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xl font-black italic tracking-tighter" style={{ color: color }}>{value}</p>
    </div>
);

const AdminTab = ({ active, onClick, children, icon }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${active ? 'bg-[#B2FF41] text-black shadow-lg shadow-[#B2FF41]/10 scale-105 mx-1' : 'text-white/20 hover:text-white/40'}`}
    >
        {icon}
        {children}
    </button>
);

const AdminInput = ({ placeholder, value, onChange }: any) => (
    <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 font-bold text-[10px] uppercase tracking-widest text-[#B2FF41] focus:outline-none focus:border-[#B2FF41]/40 transition-all placeholder:text-white/10"
    />
);

export default Admin;
