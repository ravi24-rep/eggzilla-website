import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const testimonials = [
    {
        name: 'Arun Kumar',
        role: 'Fitness Enthusiast',
        text: 'Best protein meals in Dharmapuri! The Egg Sundal Bowl is my go-to post-workout meal. Clean, tasty, and affordable.',
        rating: 5,
        avatar: 'A',
    },
    {
        name: 'Priya S',
        role: 'College Student',
        text: 'Love the cheese omelette! Quick delivery to campus and the portions are generous. Perfect for late-night studying.',
        rating: 5,
        avatar: 'P',
    },
    {
        name: 'Raj Fitness',
        role: 'Gym Trainer',
        text: 'I recommend Eggzilla to all my clients. The gym diet plates are perfectly portioned for macros. Great quality!',
        rating: 5,
        avatar: 'R',
    },
    {
        name: 'Deepa M',
        role: 'Regular Customer',
        text: 'My whole family loves Eggzilla. The fried rice is amazing and ordering via WhatsApp is super convenient!',
        rating: 4,
        avatar: 'D',
    },
];

export default function Testimonials() {
    const isMobile = useIsMobile();

    return (
        <section className="py-24 bg-egg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block bg-egg-yellow/20 text-egg-orange px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            What People Say
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-egg-black mb-4">
                            LOVED BY <span className="text-egg-orange">DHARMAPURI</span>
                        </h2>
                        <p className="text-egg-black/60 font-medium max-w-xl mx-auto">
                            Don't just take our word for it — hear from our happy customers!
                        </p>
                    </motion.div>
                </div>

                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={isMobile ? {} : { y: -8, transition: { duration: 0.2 } }}
                            className="bg-white p-6 rounded-3xl border border-egg-black/5 shadow-lg hover:shadow-xl hover:shadow-egg-orange/5 transition-all relative min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink"
                        >
                            {/* Quote icon */}
                            <div className="absolute top-4 right-4 text-egg-yellow/30">
                                <Quote size={32} />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, s) => (
                                    <Star
                                        key={s}
                                        size={14}
                                        className={s < t.rating ? 'text-egg-yellow' : 'text-egg-black/10'}
                                        fill={s < t.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>

                            {/* Review text */}
                            <p className="text-sm text-egg-black/60 mb-6 leading-relaxed">
                                "{t.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-egg-orange text-white flex items-center justify-center font-bold text-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-egg-black">{t.name}</p>
                                    <p className="text-[10px] font-semibold text-egg-black/40 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
