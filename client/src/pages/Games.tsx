import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    TrendingUp,
    Zap,
    DollarSign,
    Play,
    X,
    AlertCircle,
    Trophy,
    Target,
    ChevronRight,
    Star,
    Wallet,
    ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Games = () => {
    const { initData } = useTelegram();
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [wagerAmount, setWagerAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [placingWager, setPlacingWager] = useState(false);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/games/list`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setGames(data.games);
                }
            } catch (error) {
                console.error('Failed to fetch games');
            } finally {
                setLoading(false);
            }
        };

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

        if (initData) {
            fetchGames();
            fetchBalance();
        }
    }, [initData]);

    const handlePlayGame = (game: any) => {
        setSelectedGame(game);
        setWagerAmount(game.minWager.toString());
    };

    const handlePlaceWager = async () => {
        const wager = Number(wagerAmount);
        if (wager < selectedGame.minWager) {
            alert(`Minimum wager is ₦${selectedGame.minWager}`);
            return;
        }
        if (wager > selectedGame.maxWager) {
            alert(`Maximum wager is ₦${selectedGame.maxWager}`);
            return;
        }
        if (wager > balance) {
            alert('Insufficient balance');
            return;
        }

        setPlacingWager(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/games/play/${selectedGame.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ wager })
            });
            const data = await response.json();
            if (data.success) {
                setBalance(balance - wager);
            } else {
                alert(data.message || 'Failed to place wager');
            }
        } catch (error) {
            console.error('Wager failed:', error);
            alert('Server error');
        } finally {
            setPlacingWager(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32 overflow-x-hidden">
            <div className="mesh-gradient" />

            <header className="mb-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Gama Lounge</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Premium Gaming Nodes Online</span>
                    </div>
                </motion.div>
            </header>

            {/* Games Grid */}
            <main>
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card h-48 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {games.map((game) => (
                            <motion.div
                                key={game.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePlayGame(game)}
                                className="glass-card !p-0 overflow-hidden group border-t-2 border-t-[#A855F7] cursor-pointer"
                            >
                                <div className="h-28 relative bg-white/5">
                                    {game.imageUrl ? (
                                        <img src={game.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-purple-500/20 transition-colors">
                                            <Gamepad2 size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#A855F7] text-black text-[7px] font-black uppercase shadow-lg">
                                        Active
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-b from-[#050505]/80 to-[#050505]">
                                    <h3 className="font-black text-xs uppercase tracking-tight truncate mb-2">{game.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">₦{game.minWager} Min</span>
                                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#A855F7] group-hover:text-black transition-all">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Game Play Modal */}
            <AnimatePresence>
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#050505]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-card-bright w-full max-w-md !p-0 overflow-hidden border-[#A855F7]/30"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] border border-[#A855F7]/20">
                                        <Gamepad2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-xl uppercase tracking-tighter italic">{selectedGame.name}</h2>
                                        <p className="text-[9px] text-[#A855F7] font-black tracking-widest uppercase">Protocol Initialized</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="bg-black/40 rounded-3xl p-5 flex items-center justify-between border border-white/5 backdrop-blur-md">
                                    <div className="flex items-center gap-3 opacity-50">
                                        <Wallet size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Liquid Reserves</span>
                                    </div>
                                    <span className="font-black text-lg">₦{balance.toLocaleString()}</span>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 block">Set Wager Node</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={wagerAmount}
                                            onChange={(e) => setWagerAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 font-black text-2xl italic tracking-tight focus:outline-none focus:border-[#A855F7]/50 transition-all font-outfit"
                                        />
                                        <DollarSign className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10" size={24} />
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[50, 200, 500, 1000].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setWagerAmount(amt.toString())}
                                                className="py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase hover:bg-[#A855F7]/20 hover:border-[#A855F7]/40 transition-all"
                                            >
                                                ₦{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceWager}
                                    disabled={placingWager}
                                    className="btn-sleek-primary w-full !from-[#A855F7] !to-purple-900 shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] !text-white flex items-center justify-center gap-3 overflow-hidden"
                                >
                                    {placingWager ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Zap size={20} className="fill-white" />
                                            <span className="text-lg uppercase font-black tracking-widest">Deploy & Play</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Game Frame after wager */}
                            {!placingWager && wagerAmount && (
                                <div className="px-8 pb-8 pt-0">
                                    <div className="rounded-[2.5rem] overflow-hidden border-2 border-white/5 aspect-video bg-[#000] relative">
                                        <iframe
                                            src={selectedGame.iframeUrl}
                                            className="w-full h-full"
                                            title={selectedGame.name}
                                        />
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-none">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
                                            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest uppercase">Secured Session</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Games;
