import { motion } from 'framer-motion';
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
    UploadCloud
} from 'lucide-react';
import { useState } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import useTelegram from '../hooks/useTelegram';
import config from '../config';

const Admin = () => {
    const { initData } = useTelegram();
    const [title, setTitle] = useState('');
    const [reward, setReward] = useState('');
    const [link, setLink] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Crypto');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [isUploading, setIsUploading] = useState(false);

    const onImageUploadSuccess = (res: any) => {
        setImageUrl(res.url);
        setIsUploading(false);
    };

    const onImageUploadError = (err: any) => {
        console.error('Upload error:', err);
        setIsUploading(false);
        alert('Image upload failed');
    };

    const ikAuthenticator = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/cpa/imagekit-auth`);
            if (!response.ok) throw new Error('Auth failed');
            return await response.json();
        } catch (error) {
            throw new Error(`Authentication request failed: ${error}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/cpa/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${initData}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    reward: Number(reward),
                    link,
                    imageUrl,
                    category,
                    description
                })
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                // Clear fields
                setTitle(''); setReward(''); setLink(''); setImageUrl(''); setCategory('Crypto'); setDescription('');
            }
        } catch (error) {
            console.error('Failed to create offer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white px-6 pt-12 pb-32">
            <div className="mesh-gradient" />

            <header className="mb-10 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter mb-2">OPERATIONS HUB</h1>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">CPA Node Deployment Center</p>
            </header>

            <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div className="glass-card p-8 space-y-6">
                    <div className="relative group">
                        <label className="text-[10px] font-black uppercase text-white/30 ml-2 mb-1 block tracking-widest">Offer Title</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Binance KYC Node"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 transition-all font-outfit"
                                required
                            />
                            <Type className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase text-white/30 ml-2 mb-1 block tracking-widest">Yield (₦)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={reward}
                                    onChange={(e) => setReward(e.target.value)}
                                    placeholder="500"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 transition-all font-outfit"
                                    required
                                />
                                <DollarSign className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase text-white/30 ml-2 mb-1 block tracking-widest">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 appearance-none transition-all font-outfit"
                            >
                                <option value="Crypto">Crypto</option>
                                <option value="Fintech">Fintech</option>
                                <option value="Survey">Survey</option>
                                <option value="Apps">Apps</option>
                            </select>
                            <Box className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black uppercase text-white/30 ml-2 mb-1 block tracking-widest">Deployment Link</label>
                        <div className="relative">
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 font-bold text-sm focus:outline-none focus:border-[#00FF88]/50 transition-all"
                                required
                            />
                            <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black uppercase text-white/30 ml-2 mb-1 block tracking-widest">Cover Asset (ImageKit)</label>

                        <IKContext
                            publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                            authenticator={ikAuthenticator}
                        >
                            <div className="relative">
                                {imageUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-[#00FF88]/30 group/img">
                                        <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                                            >
                                                Remove Asset
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative overflow-hidden">
                                        <IKUpload
                                            fileName="cpa_offer.jpg"
                                            onSuccess={onImageUploadSuccess}
                                            onError={onImageUploadError}
                                            onUploadStart={() => setIsUploading(true)}
                                            useUniqueFileName={true}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl py-10 flex flex-col items-center justify-center gap-3 group-hover:border-[#00FF88]/30 transition-all">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00FF88] group-hover:bg-[#00FF88]/10 transition-all">
                                                {isUploading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold">Click to upload cover image</p>
                                                <p className="text-[9px] text-white/30 font-medium uppercase tracking-widest mt-1">Supports JPG, PNG (Max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </IKContext>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="btn-sleek-primary w-full py-5 font-black uppercase tracking-widest flex items-center justify-center gap-4 text-black shadow-lg shadow-[#00FF88]/20"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    ) : success ? (
                        <>
                            <CheckCircle2 size={24} />
                            Deploy Success
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Deploy CPA Node
                        </>
                    )}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default Admin;
