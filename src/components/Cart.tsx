import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Egg } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onWhatsAppOrder: (customerName?: string, deliveryTime?: string) => void;
}

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  key?: string;
}

function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="flex gap-4"
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-egg-black/5 flex items-center justify-center shrink-0 border border-egg-black/5">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-egg-yellow/20 to-egg-orange/10 text-egg-orange/40">
            <Egg size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-egg-black">{item.name}</h3>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-egg-black/20 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <p className="text-sm text-egg-black/50 mb-1">{item.price}</p>

        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.selectedOptions.map(opt => (
              <span key={opt} className="text-[9px] bg-egg-yellow/30 text-egg-black px-1.5 py-0.5 rounded-md font-bold">
                {opt}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-egg-black/5 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="p-1 hover:bg-white rounded-md transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="p-1 hover:bg-white rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout, onWhatsAppOrder }: CartProps) {
  const [customerName, setCustomerName] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const total = items.reduce((acc, item) => {
    const price = parseInt(item.price.replace('₹', ''));
    return acc + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-egg-black/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-egg-yellow p-2 rounded-xl">
                  <ShoppingBag size={20} className="text-egg-black" />
                </div>
                <h2 className="text-2xl font-display font-bold text-egg-black">Your Plate</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-egg-black/5 rounded-full transition-colors"
              >
                <X size={24} className="text-egg-black" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-egg-yellow/10 p-8 rounded-full mb-4">
                    <ShoppingBag size={48} className="text-egg-yellow/40" />
                  </div>
                  <p className="text-egg-black/40 font-medium">Your plate is empty.<br />Add some protein power!</p>
                  <button
                    onClick={onClose}
                    className="mt-6 text-egg-orange font-bold hover:underline"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-egg-black/5 bg-egg-white/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-egg-black/50 font-medium">Total Amount</span>
                  <span className="text-2xl font-display font-black text-egg-black">₹{total}</span>
                </div>

                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-egg-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-egg-orange focus:ring-1 focus:ring-egg-orange transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Pickup/Delivery Time (e.g., 7:30 PM)"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full bg-white border border-egg-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-egg-orange focus:ring-1 focus:ring-egg-orange transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => onWhatsAppOrder(customerName, deliveryTime)}
                    className="w-full bg-egg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-egg-orange transition-all shadow-xl shadow-egg-orange/20 flex items-center justify-center gap-2"
                  >
                    Proceed to Payment
                  </button>
                </div>
                <p className="text-center text-[10px] text-egg-black/30 mt-4 uppercase tracking-widest font-bold">
                  Secure checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
