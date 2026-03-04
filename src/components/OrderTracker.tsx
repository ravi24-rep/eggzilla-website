import { useState, useEffect } from 'react';
import { Package, Clock, ChefHat, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface TrackingData {
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    items: { item_name: string; quantity: number; price: number }[];
}

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    'Pending': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Order Received' },
    'Preparing': { icon: ChefHat, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Being Prepared' },
    'Completed': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Ready!' },
    'Cancelled': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Cancelled' },
};

const steps = ['Pending', 'Preparing', 'Completed'];

export default function OrderTracker() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<TrackingData | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-extract order ID from hash: #track/ORD-xxx
    useEffect(() => {
        const hash = window.location.hash;
        const match = hash.match(/#track\/(.+)/);
        if (match) {
            setOrderId(match[1]);
            fetchOrder(match[1]);
        }
    }, []);

    // Auto-refresh every 15 seconds
    useEffect(() => {
        if (!order) return;
        const interval = setInterval(() => fetchOrder(order.id), 15000);
        return () => clearInterval(interval);
    }, [order]);

    const fetchOrder = async (id: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/track/${id}`);
            if (!res.ok) {
                setError('Order not found. Please check your Order ID.');
                setOrder(null);
            } else {
                setOrder(await res.json());
            }
        } catch {
            setError('Unable to connect. Please try again.');
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) fetchOrder(orderId.trim().toUpperCase());
    };

    const currentStepIndex = order ? steps.indexOf(order.status) : -1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
                        className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white p-2 rounded-xl transition-all">
                        <ArrowLeft size={18} />
                    </a>
                    <div>
                        <h1 className="text-lg font-black text-white">🥚 Track Your Order</h1>
                        <p className="text-white/40 text-xs">Enter your Order ID to check status</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                        placeholder="Enter Order ID (e.g. ORD-ABC123)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500 transition-all font-mono text-sm"
                    />
                    <button type="submit" disabled={loading}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 rounded-2xl transition-all disabled:opacity-50">
                        {loading ? '...' : 'Track'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                {order && (
                    <div className="space-y-4">
                        {/* Status Progress */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                            {order.status === 'Cancelled' ? (
                                <div className="text-center">
                                    <div className="bg-red-500/20 p-4 rounded-2xl inline-block mb-3">
                                        <XCircle size={40} className="text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-black text-red-400">Order Cancelled</h2>
                                    <p className="text-white/40 text-sm mt-1">This order has been cancelled</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        {steps.map((step, i) => {
                                            const isActive = i <= currentStepIndex;
                                            const isCurrent = i === currentStepIndex;
                                            const config = statusConfig[step];
                                            const Icon = config.icon;
                                            return (
                                                <div key={step} className="flex flex-col items-center flex-1 relative">
                                                    {i > 0 && (
                                                        <div className={`absolute left-0 right-1/2 top-5 h-0.5 -translate-x-1/2 ${isActive ? 'bg-amber-500' : 'bg-white/10'}`}
                                                            style={{ width: '100%', left: '-50%' }} />
                                                    )}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${isCurrent ? 'bg-amber-500 scale-110 shadow-lg shadow-amber-500/30' : isActive ? 'bg-amber-500/50' : 'bg-white/10'}`}>
                                                        <Icon size={18} className={isCurrent ? 'text-black' : isActive ? 'text-white' : 'text-white/30'} />
                                                    </div>
                                                    <span className={`text-xs mt-2 font-bold ${isCurrent ? 'text-amber-400' : isActive ? 'text-white/60' : 'text-white/20'}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-center">
                                        <p className={`text-lg font-black ${statusConfig[order.status]?.color || 'text-white'}`}>
                                            {statusConfig[order.status]?.label || order.status}
                                        </p>
                                        <p className="text-white/30 text-xs mt-1">Auto-refreshes every 15 seconds</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Order Details */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Order Details</span>
                                <button onClick={() => fetchOrder(order.id)} className="text-white/30 hover:text-white/60 transition-colors">
                                    <RefreshCw size={14} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Order ID</span>
                                    <span className="text-white font-mono font-bold">{order.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Name</span>
                                    <span className="text-white">{order.customer_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Payment</span>
                                    <span className="text-white">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Placed At</span>
                                    <span className="text-white">{new Date(order.created_at.replace(' ', 'T') + 'Z').toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-3">
                                <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-2">Items</p>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1">
                                        <span className="text-white/70">{item.item_name} <span className="text-white/30">x{item.quantity}</span></span>
                                        <span className="text-white/50">₹{item.price}</span>
                                    </div>
                                ))}
                                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                                    <span className="text-white font-bold">Total</span>
                                    <span className="text-amber-400 font-black text-lg">₹{order.total_amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!order && !error && (
                    <div className="text-center py-16">
                        <Package size={48} className="text-white/10 mx-auto mb-4" />
                        <p className="text-white/30 font-medium">Enter your Order ID above to track your order</p>
                        <p className="text-white/15 text-sm mt-1">You received the ID when you placed your order</p>
                    </div>
                )}
            </div>
        </div>
    );
}
