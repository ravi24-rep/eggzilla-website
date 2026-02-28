import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Menu from './components/Menu';
import Location from './components/Location';
import Footer from './components/Footer';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ThreeBackground from './components/ThreeBackground';
import Testimonials from './components/Testimonials';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import LoadingScreen from './components/LoadingScreen';
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { CartItem, MenuItem } from './types';
import { CheckCircle2 } from 'lucide-react';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ name?: string, time?: string }>({});

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast(null); // Reset if already showing
    setTimeout(() => setToast(message), 10);
  };

  const addToCart = (item: MenuItem, selectedOptions?: string[]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) =>
          i.id === item.id &&
          JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existingItem) {
        showToast(`Increased ${item.name} quantity!`);
        return prevCart.map((i) =>
          i.id === item.id && JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      showToast(`${item.name} added to your plate!`);
      return [...prevCart, { ...item, quantity: 1, selectedOptions }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id === id);
      if (!item) return prevCart;

      const newQuantity = Math.max(0, item.quantity + delta);

      if (newQuantity === 0) {
        showToast(`Removed ${item.name} from your plate.`);
      } else if (delta > 0) {
        showToast(`Increased ${item.name} quantity.`);
      } else {
        showToast(`Decreased ${item.name} quantity.`);
      }

      return prevCart
        .map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
        .filter((i) => i.quantity > 0);
    });
  };

  const removeItem = (id: string) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id === id);
      if (item) showToast(`Removed ${item.name} from your plate.`);
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => {
      const price = parseInt(item.price.replace('₹', ''));
      return acc + price * item.quantity;
    }, 0);

    showToast(`Order Placed! Total: ₹${total}. Pay at the stall.`);

    console.log('--- Checkout Success ---');
    console.log('Items:', cart);
    console.log('Total:', `₹${total}`);

    setCart([]);
    setIsCartOpen(false);
  };

  const handleWhatsAppOrder = (customerName?: string, deliveryTime?: string) => {
    if (cart.length === 0) return;
    setOrderDetails({ name: customerName, time: deliveryTime });
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmPayment = (method: 'gpay' | 'stall') => {
    const total = cart.reduce((acc, item) => {
      const price = parseInt(item.price.replace('₹', ''));
      return acc + price * item.quantity;
    }, 0);

    // Format the message
    let message = `*New Order from Eggzilla!*%0A%0A`;

    if (orderDetails.name && orderDetails.name.trim() !== '') {
      message += `*Customer Name:* ${orderDetails.name.trim()}%0A`;
    }

    if (orderDetails.time && orderDetails.time.trim() !== '') {
      message += `*Pickup/Delivery Time:* ${orderDetails.time.trim()}%0A`;
    }

    message += `%0A`; // Space after details

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* x ${item.quantity}%0A`;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        message += `   _Options: ${item.selectedOptions.join(', ')}_%0A`;
      }
      message += `   Price: ${item.price}%0A%0A`;
    });

    message += `*Total Amount: ₹${total}*%0A%0A`;

    if (method === 'gpay') {
      message += `*Payment Status:* ✅ Paid via UPI/GPay%0A_(Please verify the ₹${total} transfer in your app)_`;
    } else {
      message += `*Payment Status:* 🪙 Pay at the Stall%0A_(👉 Please collect ₹${total} from the customer at the stall)_`;
    }

    // Owner's WhatsApp number
    const ownerNumber = "916374035101";
    const whatsappUrl = `https://wa.me/${ownerNumber}?text=${message}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    showToast(`Order sent to WhatsApp! Total: ₹${total}`);

    setCart([]);
    setIsCheckoutModalOpen(false);
    setOrderDetails({});
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="min-h-screen selection:bg-egg-yellow selection:text-egg-black">
      <LoadingScreen />
      <ThreeBackground />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-egg-orange z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main>
        <Hero />
        <Features />
        <About />
        <Menu onAddToCart={addToCart} />

        {/* CTA Section */}
        <section className="py-24 bg-egg-orange text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: isMobile ? "-20px" : "-50px" }}
            >
              <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-8 leading-tight">
                READY FOR AN <br />
                <span className="text-egg-black">EGG BOOST?</span>
              </h2>
              <p className="text-xl mb-12 text-white/80 font-medium max-w-2xl mx-auto">
                Join the local fitness community and fuel your night with Dharmapuri's best protein-rich egg meals.
              </p>
              <a
                href="#location"
                className="inline-block bg-egg-black text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-egg-black transition-all shadow-2xl shadow-black/20"
              >
                Visit Us Tonight
              </a>
            </motion.div>
          </div>

          {/* Decorative Floating Eggs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-egg-yellow rounded-full blur-[100px] opacity-30" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white rounded-full blur-[120px] opacity-20" />
        </section>

        <Testimonials />
        <Location />
      </main>

      <Footer />

      {/* Floating Buttons */}
      <WhatsAppButton />
      <BackToTop />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        onWhatsAppOrder={handleWhatsAppOrder}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        total={cart.reduce((acc: number, item: { price: string; quantity: number; }) => acc + parseInt(item.price.replace('₹', '')) * item.quantity, 0)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[200] bg-egg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-egg-yellow/20 min-w-[300px]"
          >
            <div className="bg-egg-yellow p-1.5 rounded-full">
              <CheckCircle2 size={18} className="text-egg-black" />
            </div>
            <p className="font-bold text-sm">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
