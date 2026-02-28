import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, CheckCircle2, Wallet, Store, Send } from 'lucide-react';
import { useState } from 'react';

type PaymentMethod = 'gpay' | 'stall';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirmPayment: (method: PaymentMethod) => void;
}

export default function CheckoutModal({ isOpen, onClose, total, onConfirmPayment }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gpay');
  const [hasClickedUPI, setHasClickedUPI] = useState(false);
  const [error, setError] = useState('');

  const upiId = 'shyamkumar20041969-1@okaxis'; // Replace with actual UPI ID
  const payeeName = 'SHYAM KUMAR S';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${total}&cu=INR`;

  const handleConfirm = () => {
    if (paymentMethod === 'gpay' && !hasClickedUPI) {
      setError('Please click the "Open UPI App" button above to initiate your payment first.');
      return;
    }

    setError('');
    setHasClickedUPI(false); // Reset for next time
    onConfirmPayment(paymentMethod);
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-[201] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-egg-black/5 flex justify-between items-center bg-egg-white">
              <div className="flex items-center gap-3">
                <div className="bg-egg-yellow p-2 rounded-xl">
                  {paymentMethod === 'gpay' ? <QrCode size={20} className="text-egg-black" /> : <Store size={20} className="text-egg-black" />}
                </div>
                <h2 className="text-xl font-display font-bold text-egg-black">Complete Your Order</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-egg-black/5 rounded-full transition-colors"
              >
                <X size={24} className="text-egg-black" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">

              {/* Payment Method Toggle */}
              <div className="flex w-full bg-egg-black/5 p-1 rounded-2xl mb-8">
                <button
                  onClick={() => {
                    setPaymentMethod('gpay');
                    setError('');
                  }}
                  className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${paymentMethod === 'gpay'
                    ? 'bg-white text-egg-black shadow-sm'
                    : 'text-egg-black/40 hover:text-egg-black/60'
                    }`}
                >
                  <QrCode size={16} /> Pay via UPI
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('stall');
                    setError('');
                  }}
                  className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${paymentMethod === 'stall'
                    ? 'bg-white text-egg-black shadow-sm'
                    : 'text-egg-black/40 hover:text-egg-black/60'
                    }`}
                >
                  <Store size={16} /> Pay on Stall
                </button>
              </div>

              {paymentMethod === 'gpay' ? (
                <div className="w-full flex flex-col items-center">
                  <p className="text-egg-black/60 text-center mb-6 font-medium">
                    Click below to open GPay, PhonePe, or Paytm and pay <span className="text-egg-black font-black">₹{total}</span> directly.
                  </p>

                  {/* Clickable UPI Button */}
                  <a
                    href={upiUrl}
                    onClick={() => {
                      setHasClickedUPI(true);
                      setError('');
                    }}
                    className={`w-full bg-white border-2 text-egg-black py-4 rounded-2xl font-bold hover:bg-egg-orange/5 transition-all flex items-center justify-center gap-3 mb-8 shadow-sm ${hasClickedUPI ? 'border-green-500 bg-green-50' : 'border-egg-black/10 hover:border-egg-orange'
                      }`}
                  >
                    <div className={`${hasClickedUPI ? 'bg-green-500' : 'bg-egg-orange'} p-1.5 rounded-lg transition-colors`}>
                      {hasClickedUPI ? <CheckCircle2 size={16} className="text-white" /> : <Send size={16} className="text-white" />}
                    </div>
                    {hasClickedUPI ? 'Payment App Opened' : `Open UPI App to Pay ₹${total}`}
                  </a>

                  <div className="w-full h-[1px] bg-egg-black/5 mb-6 relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold text-egg-black/40 uppercase tracking-widest">
                      After Payment
                    </span>
                  </div>

                  <p className="text-sm text-egg-black/50 text-center mb-4 font-medium px-4">
                    Once you've made the payment in your app, click confirm below to send your order details via WhatsApp.
                  </p>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-bold text-center mb-4 px-4 bg-red-50 py-2 rounded-lg border border-red-200"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
              ) : (
                <div className="py-2 text-center flex flex-col items-center mb-6">
                  <div className="bg-egg-orange/10 p-5 rounded-full mb-4">
                    <Wallet size={40} className="text-egg-orange" />
                  </div>
                  <h3 className="text-xl font-display font-black text-egg-black mb-2">Pay when you pickup</h3>
                  <p className="text-sm text-egg-black/60 font-medium max-w-[250px]">
                    We'll start preparing your order immediately. Please pay <span className="text-egg-black font-black">₹{total}</span> when you arrive at the stall.
                  </p>
                </div>
              )}

              <button
                onClick={handleConfirm}
                className={`w-full text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${paymentMethod === 'gpay' && !hasClickedUPI
                  ? 'bg-egg-black/30 cursor-not-allowed hidden sm:flex' // Hide or dim if not clicked
                  : 'bg-egg-black hover:bg-egg-orange cursor-pointer'
                  }`}
              >
                <CheckCircle2 size={20} />
                Send Order to WhatsApp
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
