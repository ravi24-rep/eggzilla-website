import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MENU_ITEMS, CATEGORIES, MenuItem } from '../types';
import { ShoppingCart, Plus, CheckCircle2, Egg, Loader2 } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface MenuProps {
  onAddToCart: (item: MenuItem, options?: string[]) => void;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, options?: string[]) => void;
  key?: string;
  isMobile: boolean;
}

function MenuItemCard({ item, onAddToCart, isMobile }: MenuItemCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleAdd = () => {
    onAddToCart(item, selectedOptions.length > 0 ? selectedOptions : undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Resolve the image source: use base path for relative /menu/ paths
  const basePath = (import.meta as any).env?.BASE_URL || '/';
  const imgSrc = item.image.startsWith('/menu/')
    ? `${basePath}${item.image.slice(1)}`
    : item.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9, rotateX: isMobile ? 0 : 10 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
      whileHover={isMobile ? {} : {
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-[32px] sm:rounded-[48px] p-4 sm:p-6 border border-egg-black/5 shadow-xl hover:shadow-2xl hover:shadow-egg-orange/10 transition-all flex flex-col h-full perspective-1000 transform-gpu"
    >
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] mb-4 sm:mb-6 aspect-[4/3] shrink-0 bg-egg-black/5 flex items-center justify-center">
        {!imageError ? (
          <img
            src={imgSrc}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 transform-gpu"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-egg-yellow/20 to-egg-orange/10 text-egg-orange/40">
            <Egg size={48} strokeWidth={1.5} />
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Eggzilla Special</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-egg-yellow text-egg-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {item.category}
          </span>
          {item.bestseller && (
            <span className="bg-egg-orange text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
              🔥 Popular
            </span>
          )}
        </div>
      </div>

      <div className="px-2 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-display font-bold text-egg-black">{item.name}</h3>
          <span className="text-xl font-display font-black text-egg-orange">{item.price}</span>
        </div>
        <p className="text-sm text-egg-black/50 mb-4 line-clamp-2">{item.description}</p>

        {item.customizable && item.options && (
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-egg-black/30 mb-2">Personalize</p>
            <div className="flex flex-wrap gap-2">
              {item.options.map(option => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${selectedOptions.includes(option)
                    ? 'bg-egg-yellow border-egg-yellow text-egg-black'
                    : 'bg-white border-egg-black/10 text-egg-black/60 hover:border-egg-yellow'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group/btn ${isAdded
              ? 'bg-emerald-500 text-white scale-95 shadow-inner'
              : 'bg-egg-black text-white hover:bg-egg-orange shadow-lg'
              }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 size={18} className="animate-bounce" />
                Added!
              </>
            ) : (
              <>
                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                Add to Plate
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch menu items from the backend API
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then((data: MenuItem[]) => {
        if (data && data.length > 0) {
          setMenuItems(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to hardcoded items if API is unavailable
        console.warn('API unavailable, using hardcoded menu.');
        setIsLoading(false);
      });
  }, []);

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-egg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-extrabold text-egg-black mb-4"
          >
            EXPLORE OUR <span className="text-egg-orange">MENU</span>
          </motion.h2>
          <p className="text-egg-black/60 font-medium">From classic omelettes to specialized gym diet plates.</p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto sm:flex-wrap sm:overflow-visible sm:justify-center gap-3 mb-12 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-center flex-shrink-0 sm:flex-shrink ${activeCategory === cat
                ? 'bg-egg-black text-white shadow-lg shadow-egg-black/20'
                : 'bg-white text-egg-black border border-egg-black/10 hover:border-egg-orange'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} isMobile={isMobile} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
