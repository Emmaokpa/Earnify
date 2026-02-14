import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Zap,
    MessageSquare,
    Share2,
    Heart,
    Users,
    CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import useTelegram from '../hooks/useTelegram';
import { formatCurrency } from './Earn';

const Social = () => {
    const [verifying, setVerifying] = useState<number | null>(null);
    const [completed, setCompleted] = useState<number[]>([]);

    const tasks = [
        { id: 1, platform: 'Telegram', title: 'Join Earnify Alpha Channel', reward: '1 EC', icon: <MessageSquare size={18} />, link: 'https://t.me/EarnifyAlpha' },
        { id: 2, platform: 'X / Twitter', title: 'Follow Founder Node', reward: '1 EC', icon: <Share2 size={18} />, link: 'https://x.com/Earnify' },
        { id: 3, platform: 'Instagram', title: 'Like Latest Yield Post', reward: '1 EC', icon: <Heart size={18} />, link: 'https://instagram.com/Earnify' },
        { id: 4, platform: 'Telegram', title: 'Join Partner Nexus', reward: '1 EC', icon: <Users size={18} />, link: 'https://t.me/PartnerNexus' },
    ];

    const handleTask = (task: any) => {
        window.open(task.link, '_blank');
        setVerifying(task.id);

        // Protocol verification delay
        setTimeout(() => {
            setVerifying(null);
            setCompleted(prev => [...prev, task.id]);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-16 pb-36 font-jakarta">
            <div className="gradient-aura" />
            <div className="noise-overlay" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B2FF41] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B2FF41] italic">Traffic Exchange</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Social <span className="text-[#B2FF41]">Nexus</span></h1>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Authorize engagement for yields</p>
                </header>

                <div className="bg-[#B2FF41]/5 border border-[#B2FF41]/10 rounded-[2rem] p-6 mb-10 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#B2FF41]/10 flex items-center justify-center text-[#B2FF41]">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-tight text-[#B2FF41]">Network Multiplier</h4>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Earn 1 EC per Authorized Follow</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {tasks.map((task) => {
                        const isCompleted = completed.includes(task.id);
                        const isVerifying = verifying === task.id;

                        return (
                            <div
                                key={task.id}
                                className={`premium-card p-6 flex items-center justify-between transition-all ${isCompleted ? 'opacity-40 grayscale pointer-events-none' : 'bg-[#121212]'
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${task.platform === 'Telegram' ? 'border-sky-500/20 text-sky-400' :
                                        task.platform === 'Instagram' ? 'border-pink-500/20 text-pink-400' :
                                            'border-white/10 text-white/40'
                                        } bg-black/40`}>
                                        {task.icon}
                                    </div>
                                    <div>
                                        <h5 className="text-[12px] font-black uppercase tracking-tight italic">{task.title}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{task.platform}</p>
                                            <div className="w-1 h-1 rounded-full bg-white/5" />
                                            <p className="text-[#B2FF41] text-[10px] font-black italic">{task.reward}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleTask(task)}
                                    disabled={isCompleted || isVerifying}
                                    className={`px-6 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isCompleted ? 'bg-white/5 text-white/20' :
                                        isVerifying ? 'bg-[#B2FF41]/10 text-[#B2FF41] animate-pulse border border-[#B2FF41]/20' :
                                            'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                                        }`}
                                >
                                    {isCompleted ? 'SYNCED' : isVerifying ? 'VERIFYING...' : 'INITIALIZE'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-14 p-10 bg-gradient-to-br from-[#121212] to-black border border-white/5 rounded-[2.5rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B2FF41]/5 blur-3xl" />
                    <Users size={32} className="mx-auto text-white/10 mb-6" />
                    <h4 className="text-sm font-black italic uppercase mb-2 tracking-tighter">Buy Organic Followers?</h4>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                        Boost your social accounts with real people <br /> ₦50 per permanent active follower.
                    </p>
                    <button className="text-[9px] font-black text-[#B2FF41] uppercase tracking-[0.2em] border border-[#B2FF41]/20 px-8 py-4 rounded-2xl hover:bg-[#B2FF41]/5 transition-all">
                        Order Followers
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Social;
