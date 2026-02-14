import { motion } from 'framer-motion';
import { Home, Zap, Gamepad2, Users, Wallet, Share2, Crown } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Portal' },
        { id: 'earn', icon: Zap, label: 'Nodes' },
        { id: 'social', icon: Share2, label: 'Nexus' },
        { id: 'premium', icon: Crown, label: 'VIP' },
        { id: 'withdraw', icon: Wallet, label: 'Vault' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-2">
            <div className="max-w-md mx-auto nav-pill">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="relative flex flex-col items-center justify-center min-w-[60px] h-full outline-none"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-[#B2FF41]/10 rounded-3xl blur-xl"
                                    initial={false}
                                />
                            )}

                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`transition-all duration-500 relative z-10 ${isActive
                                    ? 'text-[#B2FF41] drop-shadow-[0_0_8px_rgba(178,255,65,0.6)]'
                                    : 'text-white/20'
                                    }`}
                            />

                            <motion.span
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                                className={`text-[9px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'text-[#B2FF41]' : 'text-transparent'
                                    }`}
                            >
                                {tab.label}
                            </motion.span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-dot"
                                    className="absolute -bottom-1 w-1 h-1 bg-[#B2FF41] rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
