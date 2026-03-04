import { motion } from 'motion/react';
import { ArrowRight, Flame, Zap, Sparkles } from 'lucide-react';
import EggScene from './EggScene';
import { useIsMobile } from '../hooks/useIsMobile';
import eggzillaLogo from '../assets/eggzilla-logo.webp';

export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden bg-egg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%] bg-egg-yellow/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-egg-orange/10 rounded-full blur-[100px]" />
      </div>
      {/* Blurry Logo Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          src={eggzillaLogo}
          alt=""
          className="w-full h-full object-contain opacity-[0.10] blur-[3px] select-none pointer-events-none"
          draggable={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 pt-10 lg:pt-0 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-egg-black text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-xl shadow-black/10"
            >
              <Sparkles size={14} className="text-egg-yellow" />
              <span>Next-Gen Protein Fuel</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black text-egg-black leading-[0.9] mb-6 sm:mb-8 tracking-tighter">
              EAT <br />
              <span className="text-egg-orange">LIKE A</span> <br />
              <span className="text-stroke-black text-transparent" style={{ WebkitTextStrokeWidth: '2.5px' }}>BEAST</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-egg-black/60 max-w-lg mb-8 sm:mb-10 font-medium leading-relaxed">
              Why settle for boring meals? EGGZILLA’s power-packed combos are here to fuel your grind — morning, noon, and night.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 w-full sm:w-auto justify-center lg:justify-start">
              <motion.a
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#menu"
                className="bg-egg-black text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-egg-orange transition-all shadow-2xl shadow-egg-orange/20 group w-full sm:w-auto"
              >
                Explore Menu
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </motion.a>
              <motion.a
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#location"
                className="bg-white/50 backdrop-blur-md border-2 border-egg-black/10 text-egg-black px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-lg hover:bg-white transition-all w-full sm:w-auto text-center"
              >
                Find Us
              </motion.a>
            </div>

            <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    src={`https://picsum.photos/seed/fitness${i}/100/100`}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-white shadow-lg object-cover"
                    alt="Athlete"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="hidden sm:block h-12 w-[1px] bg-egg-black/10" />
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Zap key={s} size={12} className="text-egg-yellow" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-black text-egg-black uppercase tracking-widest">Elite Performance Fuel</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: isMobile ? 0.9 : 0.8, rotate: isMobile ? 0 : 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative h-full flex items-center justify-center"
          >
            <EggScene />

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border border-white/50 z-30 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-egg-orange p-3 rounded-2xl shadow-lg shadow-egg-orange/30">
                  <Flame className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-3xl font-display font-black text-egg-black">24g</p>
                  <p className="text-[10px] font-black text-egg-black/40 uppercase tracking-widest">Protein / Serving</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 left-0 bg-egg-black p-6 rounded-[32px] shadow-2xl z-30 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-egg-yellow p-3 rounded-2xl">
                  <Zap className="text-egg-black" size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-3xl font-display font-black text-white">100%</p>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Natural Source</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
