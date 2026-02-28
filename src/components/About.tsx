import { motion } from 'motion/react';
import { ShieldCheck, Clock, Wallet, Heart } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import myMealImage from './my-meal.png';



export default function About() {
  const isMobile = useIsMobile();
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-egg-orange" />,
      title: "Clean & Honest",
      desc: "No oil, no artificial colors, no gimmicks. Just honest food with great taste."
    },
    {
      icon: <Heart className="w-8 h-8 text-egg-orange" />,
      title: "Macro Focused",
      desc: "Customize meals that fit your macros. We help you push your healthy lifestyle forward."
    },
    {
      icon: <Wallet className="w-8 h-8 text-egg-orange" />,
      title: "Pocket-Friendly",
      desc: "Value for money pricing with exclusive deals on weekly & monthly plans."
    },
    {
      icon: <Clock className="w-8 h-8 text-egg-orange" />,
      title: "Quick Delivery",
      desc: "Delivered on time to your nearest gym or location."
    }
  ];

  return (
    <section id="about" className="py-24 bg-egg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0, rotateY: isMobile ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            <img
              src={myMealImage}
              alt="Authentic Eggzilla Meals"
              className="rounded-[32px] sm:rounded-[40px] shadow-2xl object-contain w-full h-auto hover:scale-[1.02] transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 right-4 sm:bottom-auto sm:top-1/2 sm:-right-12 sm:-translate-y-1/2">
              <div className="bg-egg-yellow text-egg-black p-3 sm:p-5 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl rotate-3">
                <p className="text-xl sm:text-2xl lg:text-4xl font-display font-black">100%</p>
                <p className="text-[8px] sm:text-[10px] lg:text-sm font-bold uppercase tracking-widest">Homemade</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
          >
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold mb-6 sm:mb-8 leading-tight">
              CLEAN MENU, <br />
              <span className="text-egg-yellow">GREAT TASTE</span>
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-8 sm:mb-12 leading-relaxed">
              We value our clients. Good source of protein, high in nutrition, prepared with love, packed gently, and delivered on time. Your health matters — customize meals that fit your macros, and we’ll help you move one step closer to your fitness goals.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
