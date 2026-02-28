import { motion } from 'motion/react';
import { Zap, Shield, Star, Users, Flame, Dumbbell, Heart, ShieldCheck } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Features() {
  const isMobile = useIsMobile();
  const stats = [
    { icon: <Dumbbell className="w-6 h-6" />, label: "Energy Boost", value: "High Protein", color: "bg-egg-orange" },
    { icon: <ShieldCheck className="w-6 h-6" />, label: "Quality", value: "100% Fresh", color: "bg-egg-black" },
    { icon: <Star className="w-6 h-6" />, label: "Rating", value: "4.8/5.0", color: "bg-egg-yellow" },
    { icon: <Users className="w-6 h-6" />, label: "Community", value: "Gym Ready", color: "bg-egg-black" }
  ];

  return (
    <section className="py-16 sm:py-32 pb-20 sm:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: isMobile ? 30 : 50, rotateX: isMobile ? 0 : 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={isMobile ? {} : {
                y: -10,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] border border-egg-black/5 shadow-2xl hover:shadow-egg-orange/10 transition-all text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-egg-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${stat.color} ${stat.color === 'bg-egg-yellow' ? 'text-egg-black' : 'text-white'} rounded-2xl sm:rounded-[24px] mb-4 sm:mb-6 shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-4xl font-display font-black text-egg-black mb-2">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-egg-black/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
