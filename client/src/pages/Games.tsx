import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Trophy,
    Star,
    ChevronRight,
    Play,
    Timer,
    Zap,
    Coins,
    X,
    Maximize2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Games = () => {
    const { initData } = useTelegram();
    const [games, setGames] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [playTime, setPlayTime] = useState(0);
    const [rewardStatus, setRewardStatus] = useState<'none' | 'tracking' | 'completed' | 'failed'>('none');
    const timerRef = useRef<any>(null);

    useEffect(() => {
        // Mock games for initial UI (Playgama style)
        setGames([
            { id: 1, title: 'Subway Surfer Pro', image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800', iframe_url: 'https://play.gama.io/games/subway-surfers', category: 'High Velocity' },
            { id: 2, title: 'Crypto Ninja', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', iframe_url: 'https://play.gama.io/games/ninja', category: 'Precision' },
            { id: 3, title: 'Vault Breaker', image_url: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca845?w=800', iframe_url: 'https://play.gama.io/games/vault', category: 'Tactical' },
        ]);
        setLoading(false);
    }, []);

    const startGame = (game: any) => {
        setSelectedGame(game);
        setPlayTime(0);
        setRewardStatus('tracking');
    };

    useEffect(() => {
        if (rewardStatus === 'tracking') {
            timerRef.current = setInterval(() => {
                setPlayTime((prev) => {
                    const next = prev + 1;
                    if (next >= 120) { // 2 minutes = 120 seconds
                        clearInterval(timerRef.current);
                        setRewardStatus('completed');
                        claimReward();
                        return 120;
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [rewardStatus]);

    const claimReward = async () => {
        try {
            // API Call to reward 1 EC
            await fetch(`${config.apiBaseUrl}/user/reward/game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${initData}` }
            });
        } catch (e) {
            console.error('Reward sync error');
        }
    };

    if (selectedGame) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col font-jakarta">
                {/* HUD */}
                <div className="p-6 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { setSelectedGame(null); setRewardStatus('none'); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <X size={18} />
                        </button>
                        <h4 className="text-xs font-black uppercase tracking-widest italic">{selectedGame.title}</h4>
                    </div>

                    <div className={`px-4 py-2 rounded-xl flex items-center gap-3 transition-all ${rewardStatus === 'completed' ? 'bg-[#B2FF41]/10 border border-[#B2FF41]/30' : 'bg-white/5 border border-white/10'}`}>
                        {rewardStatus === 'completed' ? (
                            <>
                                <CheckCircle2 size={14} className="text-[#B2FF41]" />
                                <span className="text-[10px] font-black text-[#B2FF41] uppercase tracking-widest">+1 EC AUTHORIZED</span>
                            </>
                        ) : (
                            <>
                                <Timer size={14} className="text-white/40 animate-pulse" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{Math.floor(playTime / 60)}:{(playTime % 60).toString().padStart(2, '0')} / 2:00</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Game Engine */}
                <div className="flex-1 relative overflow-hidden">
                    <iframe
                        src={selectedGame.iframe_url}
                        className="w-full h-full border-none"
                        allow="autoplay"
                    />
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-center">
                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.4em] italic leading-relaxed">Playgama Engine Protocol 4.2.1 • Secure Yield Active</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <header className="mb-14 relative z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Arcade Grid</span>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Gaming <span className="text-[#B2FF41]">Arena</span></h1>
                </div>
                <div className="bg-[#121212] px-4 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Trophy size={16} className="text-[#B2FF41]" />
                    <span className="text-xs font-black italic">PRO</span>
                </div>
            </header>

            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 gap-6">
                    {games.map((game) => (
                        <motion.div
                            key={game.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="premium-card group overflow-hidden bg-[#121212] cursor-pointer"
                            onClick={() => startGame(game)}
                        >
                            <div className="relative h-48">
                                <img src={game.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-[9px] font-black uppercase tracking-widest italic">{game.category}</span>
                                </div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[#B2FF41]">
                                    <Coins size={14} />
                                    <span className="text-xs font-black italic">1 EC / 2 MIN</span>
                                </div>
                            </div>
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="text-lg font-black uppercase tracking-tight italic">{game.title}</h3>
                                <button className="accent-btn w-12 h-12 p-0 rounded-xl">
                                    <Play size={20} fill="currentColor" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Games;
