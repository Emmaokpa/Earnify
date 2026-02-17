import { motion } from 'framer-motion';
import { Medal, Crown, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Leaderboard = () => {
    const { initData, webApp } = useTelegram();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<number>(0);
    const [, setLoading] = useState(true);
    const [type, setType] = useState<'allTime' | 'weekly'>('allTime');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/user/leaderboard?type=${type}`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success) {
                    setLeaderboard(data.leaderboard);
                    setUserRank(data.userRank);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };

        if (initData) fetchLeaderboard();
    }, [initData, type]);

    const handleToggle = (newType: 'allTime' | 'weekly') => {
        if (newType === type) return;
        webApp?.HapticFeedback.selectionChanged();
        setType(newType);
    };

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                <header className="mb-10 text-center">
                    <div className="flex justify-center items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">The Arena</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-8">Node <span className="text-[#B2FF41]">Ranking</span></h1>

                    {/* Toggle Switch */}
                    <div className="flex bg-[#121212] p-1.5 rounded-2xl border border-white/5 mx-auto max-w-[280px]">
                        <button
                            onClick={() => handleToggle('allTime')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'allTime' ? 'bg-[#B2FF41] text-black shadow-[0_0_20px_rgba(178,255,65,0.2)]' : 'text-white/30'}`}
                        >
                            Global
                        </button>
                        <button
                            onClick={() => handleToggle('weekly')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'weekly' ? 'bg-[#B2FF41] text-black shadow-[0_0_20px_rgba(178,255,65,0.2)]' : 'text-white/30'}`}
                        >
                            Weekly
                        </button>
                    </div>
                </header>

                {/* Podium */}
                <div className="flex justify-center items-end gap-2 mb-12 h-64">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <motion.div
                            initial={{ height: 0 }} animate={{ height: '70%' }}
                            className="flex-1 bg-gradient-to-t from-[#121212] to-[#1a1a1a] rounded-t-[2.5rem] border-x border-t border-white/5 p-4 flex flex-col items-center justify-end gap-3 pb-8"
                        >
                            <Medal size={24} className="text-slate-400" />
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[1].firstName}&background=121212&color=94a3b8`} className="w-full h-full rounded-[0.8rem]" alt="2" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-tight text-white/60 truncate w-full text-center italic">{topThree[1].firstName}</p>
                            <p className="text-[12px] font-black text-slate-400 italic">{topThree[1].balance.toLocaleString()} EC</p>
                        </motion.div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <motion.div
                            initial={{ height: 0 }} animate={{ height: '90%' }}
                            className="flex-1 bg-gradient-to-t from-[#B2FF41]/20 to-black rounded-t-[2.5rem] border-x border-t border-[#B2FF41]/20 p-4 flex flex-col items-center justify-end gap-4 pb-12 relative"
                        >
                            <div className="absolute -top-6">
                                <Crown size={40} className="text-[#B2FF41] animate-bounce" fill="currentColor" fillOpacity={0.2} />
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-[#B2FF41]/10 border border-[#B2FF41]/40 p-1">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[0].firstName}&background=B2FF41&color=000000`} className="w-full h-full rounded-[0.8rem]" alt="1" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-tight text-[#B2FF41] truncate w-full text-center italic">{topThree[0].firstName}</p>
                            <p className="text-xl font-black text-white italic tracking-tighter">{topThree[0].balance.toLocaleString()} <span className="text-[10px] text-[#B2FF41]">EC</span></p>
                        </motion.div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <motion.div
                            initial={{ height: 0 }} animate={{ height: '55%' }}
                            className="flex-1 bg-gradient-to-t from-[#121212] to-[#1a1a1a] rounded-t-[2.5rem] border-x border-t border-white/5 p-4 flex flex-col items-center justify-end gap-2 pb-6"
                        >
                            <Medal size={20} className="text-amber-700" />
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 p-0.5">
                                <img src={`https://ui-avatars.com/api/?name=${topThree[2].firstName}&background=121212&color=b45309`} className="w-full h-full rounded-[0.8rem]" alt="3" />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-tight text-white/40 truncate w-full text-center italic">{topThree[2].firstName}</p>
                            <p className="text-[11px] font-black text-amber-700 italic">{topThree[2].balance.toLocaleString()} EC</p>
                        </motion.div>
                    )}
                </div>

                {/* List Container */}
                <div className="space-y-3">
                    {others.map((user) => (
                        <motion.div
                            key={user.telegramId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`premium-card p-5 flex items-center justify-between group transition-all ${user.telegramId === webApp?.initDataUnsafe?.user?.id?.toString() ? 'border-[#B2FF41]/40 bg-[#B2FF41]/5' : 'bg-[#121212]'}`}
                        >
                            <div className="flex items-center gap-5">
                                <span className={`text-xs font-black italic w-6 ${user.rank <= 5 ? 'text-[#B2FF41]' : 'text-white/20'}`}>#{user.rank}</span>
                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                                    <img src={`https://ui-avatars.com/api/?name=${user.firstName}&background=0A0A0A&color=ffffff33`} className="w-full h-full rounded-xl" alt="rank" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-tight italic flex items-center gap-2">
                                        {user.firstName}
                                        {user.isPremium && <Crown size={10} className="text-yellow-500" />}
                                    </h4>
                                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{type === 'weekly' ? 'Active Yield' : `Level ${Math.floor(user.balance / 1000) + 1}`}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black italic tracking-tighter group-hover:text-[#B2FF41] transition-colors">{user.balance.toLocaleString()} <span className="text-[9px] opacity-40">EC</span></p>
                                <div className="flex items-center justify-end gap-1 mt-1 opacity-20">
                                    <Zap size={8} />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Authorized</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* User Sticky Rank (Bottom) */}
                {userRank === 0 && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }}
                        className="fixed bottom-28 left-6 right-6 z-50 p-6 bg-[#121212] border border-[#B2FF41]/20 rounded-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]">
                                <Medal size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase italic tracking-tight">Your {type === 'weekly' ? 'Weekly' : 'Global'} Rank</h4>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Status: Unranked (Top 50 required)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black italic tracking-tighter text-[#B2FF41]">#{userRank || '50+'}</div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#B2FF41]/40">Active Phase</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Leaderboard;
