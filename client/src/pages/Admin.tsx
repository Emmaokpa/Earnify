import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    LayoutDashboard,
    Zap,
    Users,
    Image as ImageIcon,
    Link as LinkIcon,
    Coins,
    ChevronRight,
    Settings,
    History,
    Shield,
    Upload,
    Database,
    Gamepad2,
    Share2,
    CheckCircle2,
    X
} from 'lucide-react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Admin = () => {
    const { initData } = useTelegram();
    const [activeTab, setActiveTab] = useState<'cpa' | 'games' | 'social'>('cpa');
    const [loading, setLoading] = useState(false);

    // CPA State
    const [cpaNodes, setCpaNodes] = useState<any[]>([]);
    const [newCpa, setNewCpa] = useState({ title: '', reward: '', category: '', image_url: '', platform: '' });

    // Games State
    const [arcadeModules, setArcadeModules] = useState<any[]>([]);
    const [newGame, setNewGame] = useState({ title: '', iframe_url: '', image_url: '', category: 'Arcade' });

    // Social Tasks State
    const [socialTasks, setSocialTasks] = useState<any[]>([]);
    const [newSocial, setNewSocial] = useState({ channel_id: '', platform: 'Telegram', budget: '', reward: '1 EC' });

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [cpaRes, gamesRes] = await Promise.all([
                fetch(`${config.apiBaseUrl}/cpa/offers`),
                fetch(`${config.apiBaseUrl}/games/list`)
            ]);
            const [cpaData, gamesData] = await Promise.all([cpaRes.json(), gamesRes.json()]);
            if (cpaData.success) setCpaNodes(cpaData.offers);
            // if (gamesData.success) setArcadeModules(gamesData.games);
        } catch (error) {
            console.error('Admin fetch error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateCpa = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/admin/cpa/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${initData}` },
                body: JSON.stringify(newCpa)
            });
            if (response.ok) {
                setNewCpa({ title: '', reward: '', category: '', image_url: '', platform: '' });
                fetchAllData();
            }
        } catch (error) {
            alert('Failed to create node');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <header className="mb-14 relative z-10 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">System Admin</span>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Operations Hub</h1>
                </div>
                <div className="bg-[#121212] p-4 rounded-2xl border border-white/5">
                    <Database size={20} className="text-[#B2FF41]" />
                </div>
            </header>

            <div className="flex gap-2 mb-10 p-1.5 bg-[#121212] rounded-[1.8rem] border border-white/5 relative z-10">
                <AdminTab active={activeTab === 'cpa'} onClick={() => setActiveTab('cpa')} icon={<Zap size={14} />}>CPA</AdminTab>
                <AdminTab active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<Gamepad2 size={14} />}>Arcade</AdminTab>
                <AdminTab active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Share2 size={14} />}>Nexus</AdminTab>
            </div>

            <div className="space-y-10 relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'cpa' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="cpa">
                            <AdminForm title="Initialize New CPA Node" onSubmit={handleCreateCpa}>
                                <AdminInput placeholder="Node Title (e.g. Binance KYC)" value={newCpa.title} onChange={(v) => setNewCpa({ ...newCpa, title: v })} />
                                <AdminInput placeholder="Price / Reward (in EC)" value={newCpa.reward} onChange={(v) => setNewCpa({ ...newCpa, reward: v })} />
                                <AdminInput placeholder="Category (e.g. Crypto)" value={newCpa.category} onChange={(v) => setNewCpa({ ...newCpa, category: v })} />
                                <AdminInput placeholder="ImageKit URL" value={newCpa.image_url} onChange={(v) => setNewCpa({ ...newCpa, image_url: v })} />
                            </AdminForm>
                        </motion.div>
                    )}

                    {activeTab === 'games' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="games">
                            <AdminForm title="Deploy Arcade Module (Playgama)" onSubmit={() => { }}>
                                <AdminInput placeholder="Game Name" value={newGame.title} onChange={(v) => setNewGame({ ...newGame, title: v })} />
                                <AdminInput placeholder="Iframe Endpoint / URL" value={newGame.iframe_url} onChange={(v) => setNewGame({ ...newGame, iframe_url: v })} />
                                <AdminInput placeholder="Poster Identity (ImageKit URL)" value={newGame.image_url} onChange={(v) => setNewGame({ ...newGame, image_url: v })} />
                                <div className="mt-4 bg-[#B2FF41]/5 border border-[#B2FF41]/10 rounded-2xl p-4 flex items-center gap-3">
                                    <History size={16} className="text-[#B2FF41]" />
                                    <p className="text-[10px] font-black uppercase text-[#B2FF41]/60 tracking-widest">Payout logic: 2 min dwell = 1 EC</p>
                                </div>
                            </AdminForm>
                        </motion.div>
                    )}

                    {activeTab === 'social' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="social">
                            <AdminForm title="Social Nexus Slot (Audience Sale)" onSubmit={() => { }}>
                                <AdminInput placeholder="Channel ID / Link" value={newSocial.channel_id} onChange={(v) => setNewSocial({ ...newSocial, channel_id: v })} />
                                <AdminInput placeholder="Advertiser Budget (NGN)" value={newSocial.budget} onChange={(v) => setNewSocial({ ...newSocial, budget: v })} />
                                <div className="p-4 bg-[#121212] rounded-2xl border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/20">Market Rate</span>
                                        <span className="text-[#B2FF41]">₦50 / Follower</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/20">User Yield</span>
                                        <span className="text-[#B2FF41]">1 EC / Node</span>
                                    </div>
                                </div>
                            </AdminForm>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const AdminTab = ({ active, onClick, children, icon }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${active ? 'bg-[#B2FF41] text-black shadow-lg shadow-[#B2FF41]/20 scale-105' : 'text-white/20 hover:text-white/40'
            }`}
    >
        {icon}
        {children}
    </button>
);

const AdminForm = ({ title, children, onSubmit }: any) => (
    <div className="premium-card p-10 bg-[#0A0A0A] space-y-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic text-[#B2FF41]">{title}</h3>
        <div className="space-y-5">
            {children}
        </div>
        <button
            onClick={onSubmit}
            className="accent-btn w-full h-16 uppercase tracking-[0.2em] italic text-xs"
        >
            Deploy Protocol <Plus size={18} />
        </button>
    </div>
);

const AdminInput = ({ placeholder, value, onChange }: any) => (
    <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest text-white/60 focus:outline-none focus:border-[#B2FF41]/40 transition-all placeholder:text-white/5"
    />
);

export default Admin;
