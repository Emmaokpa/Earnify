import { motion } from 'framer-motion';
import { Home, Zap, Users, Wallet, Plus } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'earn', icon: Zap, label: 'Earn' },
        { id: 'admin', icon: Plus, label: 'Ops' },
        { id: 'referrals', icon: Users, label: 'Refer' },
        { id: 'withdraw', icon: Wallet, label: 'Wallet' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-10 pointer-events-none">
            {/* Dynamic Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00FF88]/10 to-transparent h-40 mt-auto pointer-events-none opacity-50" />

            <div className="max-w-md mx-auto relative pointer-events-auto">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="nav-glass flex items-center justify-between px-2 !fixed !relative !bottom-0 !left-0 !right-0 h-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className="relative flex flex-col items-center justify-center flex-1 h-full outline-none group overflow-hidden first:rounded-l-[1.8rem] last:rounded-r-[1.8rem]"
                            >
                                {/* Active Backdrop Highlight */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-glow"
                                        className="absolute inset-2 bg-[#00FF88]/10 rounded-2xl z-0"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
                                    </motion.div>
                                )}

                                <div className="relative z-10 flex flex-col items-center gap-1.5 pt-1">
                                    <motion.div
                                        animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Icon
                                            size={20}
                                            className={`transition-all duration-500 ${isActive ? 'text-[#00FF88] drop-shadow-[0_0_12px_rgba(0,255,136,0.6)]' : 'text-white/20 group-hover:text-white/40'
                                                }`}
                                            fill={isActive ? 'rgba(0, 255, 136, 0.2)' : 'none'}
                                        />
                                    </motion.div>

                                    <motion.span
                                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.9 }}
                                        className={`text-[9px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-white' : 'text-white/20'
                                            }`}
                                    >
                                        {tab.label}
                                    </motion.span>
                                </div>

                                {/* Animated Inner Shine for Active Tab */}
                                {isActive && (
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default BottomNav;
