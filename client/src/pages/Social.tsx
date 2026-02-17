import { motion } from 'framer-motion';
import {
    Zap,
    MessageSquare,
    Share2,
    Heart,
    Users,
    ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import OrderFollowers from './OrderFollowers';
import config from '../config'; // Assuming config is imported from here

const Social = () => {
    const { webApp, initData } = useTelegram();
    const [view, setView] = useState<'main' | 'order'>('main');
    const [verifying, setVerifying] = useState<string | null>(null);
    const [loadingPulse, setLoadingPulse] = useState<string | null>(null);
    const [completed, setCompleted] = useState<string[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/social/list`, {
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.tasks);
                // Extract already completed tasks from the new server response
                const serverCompleted = data.tasks.filter((t: any) => t.completed).map((t: any) => t.id);
                setCompleted(serverCompleted);
            }
        } catch (error) {
            console.error('Fetch tasks error', error);
        }
    };

    useEffect(() => {
        if (initData) fetchTasks();
    }, [initData]);

    const handleTaskLaunch = (task: any) => {
        const link = task.channel_id.startsWith('http') ? task.channel_id : `https://t.me/${task.channel_id.replace('@', '')}`;
        window.open(link, '_blank');
        // Set to verifying status (means waiting for them to click verify button)
        setVerifying(task.id);
    };

    const handleVerifyCompletion = async (taskId: string) => {
        setLoadingPulse(taskId);
        try {
            const response = await fetch(`${config.apiBaseUrl}/social/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${initData}`
                },
                body: JSON.stringify({ taskId })
            });
            const data = await response.json();

            if (data.success) {
                setCompleted(prev => [...prev, taskId]);
                setVerifying(null);
                webApp?.HapticFeedback.notificationOccurred('success');
                webApp?.showAlert("Protocol Synced! Reward transmitted.");
            } else {
                webApp?.showAlert(data.message || "Membership not detected in Nexus.");
            }
        } catch (error) {
            webApp?.showAlert("Encryption Error: Nexus offline.");
        } finally {
            setLoadingPulse(null);
        }
    };

    if (view === 'order') return <OrderFollowers onBack={() => setView('main')} />;

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
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Earn EC by joining verified nodes</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {tasks.map((task) => {
                        const isCompleted = completed.includes(task.id);
                        const isAwaitingVerify = verifying === task.id;
                        const isProcessing = loadingPulse === task.id;

                        return (
                            <div
                                key={task.id}
                                className={`premium-card p-6 flex items-center justify-between transition-all ${isCompleted ? 'opacity-40 grayscale pointer-events-none' : 'bg-[#121212]'
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${task.platform === 'Telegram' ? 'border-[#0088cc]/20 text-[#0088cc]' :
                                        task.platform === 'Instagram' ? 'border-[#E1306C]/20 text-[#E1306C]' :
                                            'border-white/10 text-white/40'
                                        } bg-black/40`}>
                                        {task.platform === 'Telegram' && <MessageSquare size={18} />}
                                        {task.platform === 'Instagram' && <Heart size={18} />}
                                        {task.platform === 'X' && <Share2 size={18} />}
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

                                {isCompleted ? (
                                    <div className="px-6 h-12 rounded-xl bg-white/5 text-white/20 flex items-center justify-center text-[9px] font-black uppercase tracking-widest">
                                        SYNCED
                                    </div>
                                ) : isAwaitingVerify ? (
                                    <button
                                        onClick={() => handleVerifyCompletion(task.id)}
                                        disabled={isProcessing}
                                        className={`px-6 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#B2FF41] text-black shadow-[0_0_20px_rgba(178,255,65,0.3)] ${isProcessing ? 'animate-pulse' : ''}`}
                                    >
                                        {isProcessing ? 'SCANNING...' : 'VERIFY JOIN'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleTaskLaunch(task)}
                                        className="px-6 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white text-black hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        INITIALIZE
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div
                    onClick={() => setView('order')}
                    className="mt-14 p-10 bg-gradient-to-br from-[#121212] to-black border border-white/5 rounded-[2.5rem] text-center relative overflow-hidden cursor-pointer hover:bg-[#1A1A1A] transition-all group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B2FF41]/5 blur-3xl" />
                    <Users size={32} className="mx-auto text-white/10 mb-6 group-hover:text-[#B2FF41]/40 transition-colors" />
                    <h4 className="text-sm font-black italic uppercase mb-2 tracking-tighter">Buy Organic Followers?</h4>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                        Boost your social accounts with real people <br /> Deployment starting at 5 EC per user.
                    </p>
                    <div className="flex items-center justify-center gap-3 text-[9px] font-black text-[#B2FF41] uppercase tracking-[0.2em] border border-[#B2FF41]/20 px-8 py-4 rounded-2xl group-hover:bg-[#B2FF41] group-hover:text-black transition-all">
                        Growth Terminal <ArrowRight size={14} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Social;
