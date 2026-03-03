import { motion } from 'motion/react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import eggzillaLogo from '../assets/eggzilla-logo.png';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Location', href: '#location' },
    { name: 'Track Order', href: '#track/' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-egg-yellow/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
            >
              <img src={eggzillaLogo} alt="Eggzilla Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            </motion.div>
            <span className="text-2xl font-display font-extrabold text-egg-black tracking-tighter">
              EGG<span className="text-egg-orange">ZILLA</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-egg-black/70 hover:text-egg-orange transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#menu"
              className="bg-egg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-egg-orange transition-all shadow-lg shadow-egg-orange/20"
            >
              Order Now
            </a>

            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={onOpenCart}
              className="relative cursor-pointer bg-egg-yellow/20 p-2 rounded-xl text-egg-black"
              role="button"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-egg-orange text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <div
              onClick={onOpenCart}
              className="relative cursor-pointer bg-egg-yellow/20 p-2 rounded-xl text-egg-black"
              role="button"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-egg-orange text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-egg-black"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-egg-yellow/20 px-4 pt-2 pb-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-egg-black"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#menu"
            onClick={() => setIsOpen(false)}
            className="bg-egg-yellow text-egg-black text-center py-3 rounded-xl font-bold"
          >
            View Menu
          </a>
        </motion.div>
      )}
    </nav>
  );
}
