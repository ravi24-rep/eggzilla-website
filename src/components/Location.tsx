import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Navigation, ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Location() {
  const isMobile = useIsMobile();

  return (
    <section id="location" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
          >
            <div className="inline-block bg-egg-orange/10 text-egg-orange px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              Find Us
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-egg-black mb-8">
              VISIT THE <br />
              <span className="text-egg-orange">EGGZILLA</span> STALL
            </h2>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="bg-egg-black p-3 rounded-2xl text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-egg-black">Our Location</h4>
                  <p className="text-egg-black/60">Located near District Stadium, Dharmapuri</p>
                  <p className="text-egg-black/60 text-sm mt-1">🚚 Delivery available at your nearest gym</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-egg-black p-3 rounded-2xl text-white">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-egg-black">Call Us</h4>
                  <p className="text-egg-black/60">9486318604 | 9659750099</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-egg-black p-3 rounded-2xl text-white">
                  <Navigation size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-egg-black">Order Timings</h4>
                  <p className="text-egg-black/60 text-sm">Breakfast & Lunch: Order before 6 AM</p>
                  <p className="text-egg-black/60 text-sm">Dinner: Order before 6 PM</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Orders Open Now!
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=12.131275385351476,78.15635387577092"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-egg-yellow text-egg-black px-8 py-4 rounded-2xl font-bold hover:bg-egg-orange transition-all shadow-xl shadow-egg-yellow/20"
            >
              Get Directions
              <ExternalLink size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0, rotateY: isMobile ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[400px] sm:h-[500px] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border-4 sm:border-8 border-white perspective-1000"
          >
            {/* Placeholder for Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.5!2d78.15635387577092!3d12.131275385351476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA3JzUyLjYiTiA3OMKwMDknMjIuOSJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
