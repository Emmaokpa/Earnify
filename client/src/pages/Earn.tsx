import { motion } from 'framer-motion';
import {
    PlayCircle,
    Target,
    MessageSquare,
    Share2,
    ChevronRight,
    Zap,
    TrendingUp,
    Clock,
    ShieldCheck,
    ArrowUpRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Earn = () => {
    const { initData, webApp } = useTelegram();
    const [loadingTask, setLoadingTask] = useState<string | null>(null);
    const [cpaOffers, setCpaOffers] = useState<any[]>([]);
    const [loadingOffers, setLoadingOffers] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/cpa/offers`, {
                    headers: { 'Authorization': `Bearer ${initData}` }
                });
                const data = await response.json();
                if (data.success && data.offers.length > 0) {
                    setCpaOffers(data.offers);
                } else {
                    // Fallback mock data
                    setCpaOffers([
                        { id: '1', title: 'Bybit Premium Sign-up', reward: 500, category: 'Crypto', link: 'https://bybit.com' },
                        { id: '2', title: 'Opay Virtual Card', reward: 150, category: 'Fintech', link: 'https://opayweb.com' },
                        { id: '3', title: 'PalmPay Daily Task', reward: 50, category: 'Finance', link: 'https://palmpay.com' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch offers');
            } finally {
                setLoadingOffers(false);
            }
        };

        if (initData) fetchOffers();
    }, [initData]);

    const handleCpaClick = async (offer: any) => {
        try {
            await fetch(`${config.apiBaseUrl}/cpa/click/${offer.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            if (webApp) {
                webApp.openLink(offer.link);
            } else {
                window.open(offer.link, '_blank');
            }
        } catch (error) {
            console.error('Click tracking failed');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const handleTaskAction = async (taskId: string, reward: number) => {
        setLoadingTask(taskId);
        try {
            const response = await fetch(`${config.apiBaseUrl}/user/complete-ad`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${initData}` }
            });
            const data = await response.json();
            if (data.success) {
                alert(`Task Complete! +₦${reward}`);
            } else {
                alert(data.message || 'Task failed');
            }
        } catch (error) {
            console.error('Task failed', error);
            alert('Server error');
        } finally {
            setLoadingTask(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32">
            <div className="mesh-gradient" />

            <motion.header
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">EARN PORTAL</h1>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40">Real-time Task Nodes Active</span>
                </div>
            </motion.header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* Tier Cards */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 border-l-2 border-l-[#00FF88]">
                        <TrendingUp size={16} className="text-[#00FF88] mb-2" />
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Active Multiplier</p>
                        <p className="text-xl font-black">1.2x</p>
                    </div>
                    <div className="glass-card p-4 border-l-2 border-l-blue-500">
                        <Clock size={16} className="text-blue-500 mb-2" />
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Next Reset</p>
                        <p className="text-xl font-black">04:20:12</p>
                    </div>
                </section>

                {/* Categories */}
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">Ad Revenue Nodes</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {[
                    { id: 'ad1', title: 'Stream Node 01', reward: 5, icon: <PlayCircle size={20} />, time: '30s', difficulty: 'Easy' },
                    { id: 'ad2', title: 'Stream Node 02', reward: 5, icon: <PlayCircle size={20} />, time: '30s', difficulty: 'Easy' },
                    { id: 'ad3', title: 'Stream Node 03', reward: 5, icon: <PlayCircle size={20} />, time: '30s', difficulty: 'Easy' },
                ].map((task) => (
                    <TaskNode
                        key={task.id}
                        {...task}
                        loading={loadingTask === task.id}
                        onClick={() => handleTaskAction(task.id, task.reward)}
                    />
                ))}

                <div className="flex items-center gap-3 mt-8 mb-2">
                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white/30">CPA High-Yield Nodes</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-4">
                    {cpaOffers.map((offer) => (
                        <motion.div
                            key={offer.id}
                            variants={itemVariants}
                            onClick={() => handleCpaClick(offer)}
                            className="glass-card-bright p-6 group cursor-pointer overflow-hidden relative"
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target size={16} className="text-orange-400" />
                                        <span className="text-[9px] font-black bg-orange-400/20 text-orange-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {offer.category}
                                        </span>
                                    </div>
                                    <h3 className="text-md font-black tracking-tight leading-tight mb-1 uppercase">{offer.title}</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic">Verification required</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-[#00FF88]">₦{offer.reward}</div>
                                    <div className="text-[8px] font-black text-white/20 uppercase">Node Yield</div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-end relative z-10">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-[#00FF88]/60 uppercase tracking-widest group-hover:text-[#00FF88] transition-colors">
                                    Initialize Node <ArrowUpRight size={12} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const TaskNode = ({ title, reward, icon, time, difficulty, onClick, loading }: any) => (
    <motion.div
        whileHover={{ x: 4 }}
        className="glass-card p-5 flex items-center justify-between group cursor-pointer border-r-2 border-r-transparent hover:border-r-[#00FF88] transition-all"
        onClick={onClick}
    >
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#00FF88] group-hover:bg-[#00FF88]/10 transition-all">
                {loading ? <Zap size={20} className="animate-spin" /> : icon}
            </div>
            <div>
                <h4 className="font-black text-sm uppercase tracking-tight">{title}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{time}</span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{difficulty}</span>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-lg font-black text-[#00FF88]">₦{reward}</span>
            <span className="text-[8px] font-black text-white/20 uppercase">Reward</span>
        </div>
    </motion.div>
);

export default Earn;
