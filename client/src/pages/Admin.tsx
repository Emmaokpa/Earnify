import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Image as ImageIcon,
    Type,
    Link as LinkIcon,
    DollarSign,
    Box,
    Send,
    CheckCircle2,
    Loader2,
    UploadCloud,
    Gamepad2,
    Database,
    ChevronRight,
    Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Admin = () => {
    const { initData } = useTelegram();
    const [activeTab, setActiveTab] = useState('cpa');

    // CPA States
    const [offers, setOffers] = useState<any[]>([]);
    const [cpaTitle, setCpaTitle] = useState('');
    const [cpaReward, setCpaReward] = useState('');
    const [cpaLink, setCpaLink] = useState('');
    const [cpaImageUrl, setCpaImageUrl] = useState('');
    const [cpaCategory, setCpaCategory] = useState('Crypto');
    const [cpaLoading, setCpaLoading] = useState(false);
    const [cpaSuccess, setCpaSuccess] = useState(false);

    // Game States
    const [games, setGames] = useState<any[]>([]);
    const [gameName, setGameName] = useState('');
    const [gameIframe, setGameIframe] = useState('');
    const [gameImageUrl, setGameImageUrl] = useState('');
    const [gameMinWager, setGameMinWager] = useState('50');
    const [gameMaxWager, setGameMaxWager] = useState('5000');
    const [gameLoading, setGameLoading] = useState(false);
    const [gameSuccess, setGameSuccess] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const fetchData = async () => {
        try {
            const [offersRes, gamesRes] = await Promise.all([
                fetch(`${config.apiBaseUrl}/cpa/offers`, { headers: { 'Authorization': `Bearer ${initData}` } }),
                fetch(`${config.apiBaseUrl}/games/list`, { headers: { 'Authorization': `Bearer ${initData}` } })
            ]);
            const offersData = await offersRes.json();
            const gamesData = await gamesRes.json();
            if (offersData.success) setOffers(offersData.offers);
            if (gamesData.success) setGames(gamesData.games);
        } catch (error) {
            console.error('Admin fetch error');
        }
    };

    useEffect(() => {
        if (initData) fetchData();
    }, [initData]);

    const ikAuthenticator = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/cpa/imagekit-auth`);
            return await response.json();
        } catch (error) {
            throw new Error(`Auth failed: ${error}`);
        }
    };

    const handleCreateCpa = async (e: React.FormEvent) => {
        e.preventDefault();
        setCpaLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/cpa/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: cpaTitle,
                    link: cpaLink,
                    reward: Number(cpaReward),
                    imageUrl: cpaImageUrl,
                    category: cpaCategory
                })
            });
            const data = await response.json();
            if (data.success) {
                setCpaSuccess(true);
                setTimeout(() => setCpaSuccess(false), 3000);
                setCpaTitle(''); setCpaLink(''); setCpaReward(''); setCpaImageUrl('');
                fetchData();
            }
        } catch (error) {
            alert('Deployment failed');
        } finally {
            setCpaLoading(false);
        }
    };

    const handleCreateGame = async (e: React.FormEvent) => {
        e.preventDefault();
        setGameLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/games/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: gameName,
                    iframeUrl: gameIframe,
                    imageUrl: gameImageUrl,
                    minWager: Number(gameMinWager),
                    maxWager: Number(gameMaxWager)
                })
            });
            const data = await response.json();
            if (data.success) {
                setGameSuccess(true);
                setTimeout(() => setGameSuccess(false), 3000);
                setGameName(''); setGameIframe(''); setGameImageUrl('');
                fetchData();
            }
        } catch (error) {
            alert('Game integration failed');
        } finally {
            setGameLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32">
            <div className="mesh-gradient" />

            <header className="mb-10 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter mb-2">OPERATIONS HUB</h1>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Network Command & Control</p>
            </header>

            {/* Neon Tabs */}
            <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                <button
                    onClick={() => setActiveTab('cpa')}
                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cpa' ? 'bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'text-white/30 hover:text-white/60'
                        }`}
                >
                    CPA Nodes
                </button>
                <button
                    onClick={() => setActiveTab('games')}
                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'games' ? 'bg-[#A855F7] text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-white/30 hover:text-white/60'
                        }`}
                >
                    PlayGama
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'cpa' ? (
                    <motion.div
                        key="cpa"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-8"
                    >
                        <form onSubmit={handleCreateCpa} className="space-y-6">
                            <div className="glass-card p-8 space-y-6 border-t-2 border-t-[#00FF88]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
                                    <Plus size={16} className="text-[#00FF88]" /> Deploy CPA Node
                                </h3>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            placeholder="Offer Title"
                                            value={cpaTitle}
                                            onChange={(e) => setCpaTitle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/40"
                                            required
                                        />
                                        <Type className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            placeholder="Reward (₦)"
                                            value={cpaReward}
                                            onChange={(e) => setCpaReward(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/40"
                                            required
                                        />
                                        <select
                                            value={cpaCategory}
                                            onChange={(e) => setCpaCategory(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/40 appearance-none"
                                        >
                                            <option value="Crypto">Crypto</option>
                                            <option value="Fintech">Fintech</option>
                                            <option value="Apps">Apps</option>
                                        </select>
                                    </div>
                                    <input
                                        placeholder="Target Link (https://...)"
                                        value={cpaLink}
                                        onChange={(e) => setCpaLink(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/40"
                                        required
                                    />

                                    <IKContext
                                        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        authenticator={ikAuthenticator}
                                    >
                                        <div className="relative group/upload">
                                            {cpaImageUrl ? (
                                                <div className="relative h-32 rounded-2xl overflow-hidden group">
                                                    <img src={cpaImageUrl} className="w-full h-full object-cover opacity-50" />
                                                    <button onClick={() => setCpaImageUrl('')} className="absolute inset-0 flex items-center justify-center bg-red-500/20 text-red-500 font-black uppercase text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                                </div>
                                            ) : (
                                                <div className="relative h-32 bg-white/5 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover/upload:border-[#00FF88]/30 transition-all">
                                                    <IKUpload
                                                        onSuccess={(res: any) => setCpaImageUrl(res.url)}
                                                        onUploadStart={() => setIsUploading(true)}
                                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                    />
                                                    <UploadCloud className="text-white/20 mb-2" size={24} />
                                                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Upload Asset</span>
                                                </div>
                                            )}
                                        </div>
                                    </IKContext>
                                </div>

                                <button type="submit" disabled={cpaLoading || isUploading} className="btn-sleek-primary w-full py-5 !text-black shadow-[0_15px_30px_rgba(0,255,136,0.15)] flex items-center justify-center gap-3">
                                    {cpaLoading ? <Loader2 className="animate-spin" /> : cpaSuccess ? <CheckCircle2 /> : <Send size={18} />}
                                    <span className="font-black uppercase tracking-widest">{cpaSuccess ? 'Deployed' : 'Authorize Node'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="games"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-8"
                    >
                        <form onSubmit={handleCreateGame} className="space-y-6">
                            <div className="glass-card p-8 space-y-6 border-t-2 border-t-[#A855F7]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
                                    <Gamepad2 size={16} className="text-[#A855F7]" /> Integrate PlayGama
                                </h3>

                                <div className="space-y-4">
                                    <input
                                        placeholder="Game Title"
                                        value={gameName}
                                        onChange={(e) => setGameName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#A855F7]/40"
                                        required
                                    />
                                    <input
                                        placeholder="Iframe URL"
                                        value={gameIframe}
                                        onChange={(e) => setGameIframe(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#A855F7]/40"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Min Wager</span>
                                            <input
                                                type="number"
                                                value={gameMinWager}
                                                onChange={(e) => setGameMinWager(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 font-bold text-sm focus:outline-none focus:border-[#A855F7]/40"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-2">Max Wager</span>
                                            <input
                                                type="number"
                                                value={gameMaxWager}
                                                onChange={(e) => setGameMaxWager(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 font-bold text-sm focus:outline-none focus:border-[#A855F7]/40"
                                            />
                                        </div>
                                    </div>

                                    <IKContext
                                        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        authenticator={ikAuthenticator}
                                    >
                                        <div className="relative group/upload">
                                            {gameImageUrl ? (
                                                <div className="relative h-32 rounded-2xl overflow-hidden group">
                                                    <img src={gameImageUrl} className="w-full h-full object-cover opacity-50" />
                                                    <button onClick={() => setGameImageUrl('')} className="absolute inset-0 flex items-center justify-center bg-red-500/20 text-red-500 font-black uppercase text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                                </div>
                                            ) : (
                                                <div className="relative h-32 bg-white/5 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover/upload:border-[#A855F7]/30 transition-all">
                                                    <IKUpload
                                                        onSuccess={(res: any) => setGameImageUrl(res.url)}
                                                        onUploadStart={() => setIsUploading(true)}
                                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                    />
                                                    <Gamepad2 className="text-white/20 mb-2" size={24} />
                                                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Upload Game Icon</span>
                                                </div>
                                            )}
                                        </div>
                                    </IKContext>
                                </div>

                                <button type="submit" disabled={gameLoading || isUploading} className="btn-sleek-primary w-full py-5 !bg-[#A855F7] !text-black shadow-[0_15px_30px_rgba(168,85,247,0.15)] flex items-center justify-center gap-3">
                                    {gameLoading ? <Loader2 className="animate-spin" /> : gameSuccess ? <CheckCircle2 /> : <Send size={18} />}
                                    <span className="font-black uppercase tracking-widest">{gameSuccess ? 'Integrated' : 'Initialize Game'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
