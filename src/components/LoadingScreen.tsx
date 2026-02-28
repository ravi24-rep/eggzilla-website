import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import eggzillaLogo from '../assets/eggzilla-logo.png';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[999] bg-egg-black flex flex-col items-center justify-center"
                >
                    {/* Logo bounce */}
                    <motion.img
                        src={eggzillaLogo}
                        alt="Eggzilla"
                        className="w-32 h-32 object-contain mb-8"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    />

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl font-display font-black text-white tracking-tighter"
                    >
                        EGG<span className="text-egg-orange">ZILLA</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-white/40 text-sm font-bold mt-2 uppercase tracking-widest"
                    >
                        Protein Power Food
                    </motion.p>

                    {/* Loading bar */}
                    <motion.div
                        className="mt-10 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="h-full bg-egg-yellow rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
