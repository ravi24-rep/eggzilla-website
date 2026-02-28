import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = '916374035101';
    const message = encodeURIComponent('Hi Eggzilla! I would like to place an order 🍳');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <AnimatePresence>
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-2xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-shadow group"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={22} className="sm:!w-7 sm:!h-7 group-hover:rotate-12 transition-transform" />

                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

                {/* Tooltip - hidden on mobile */}
                <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-egg-black text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Order on WhatsApp 💬
                </span>
            </motion.a>
        </AnimatePresence>
    );
}
