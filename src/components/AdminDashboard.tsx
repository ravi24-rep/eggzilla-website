import { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, LogOut, RefreshCw, Package, IndianRupee, Clock, ChefHat, Eye, EyeOff, ArrowLeft, Ban, Bell, BellOff, Download, Trash2, Plus, BarChart3, TrendingUp, Star, Timer } from 'lucide-react';

// =============================================
// TYPES
// =============================================
interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
}

interface OrderItem {
    id: number;
    order_id: string;
    item_name: string;
    quantity: number;
    price: number;
}

interface AdminMenuItem {
    id: string;
    name: string;
    price: string;
    category: string;
    image: string;
    available: boolean;
    bestseller: boolean;
}

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    todayOrders: number;
    todayRevenue: number;
    cancelledOrders: number;
}

// Play a notification sound using Web Audio API (no external files needed)
function playNotificationSound() {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 830;
        osc.type = 'sine';
        gain.gain.value = 0.3;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
        // Second beep
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1050;
            osc2.type = 'sine';
            gain2.gain.value = 0.3;
            osc2.start();
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc2.stop(ctx.currentTime + 0.5);
        }, 200);
    } catch { /* silent fallback */ }
}

// =============================================
// PIN LOGIN SCREEN
// =============================================
function PinLogin({ onLogin }: { onLogin: () => void }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            });
            if (res.ok) {
                onLogin();
            } else {
                setError('Incorrect PIN. Try again.');
                setPin('');
            }
        } catch {
            setError('Server unavailable. Run npm start first.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm border border-white/10 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-amber-500/20 p-4 rounded-2xl mb-4">
                        <Lock size={32} className="text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Eggzilla Admin</h1>
                    <p className="text-white/50 text-sm mt-1">Enter PIN to access dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => { setPin(e.target.value); setError(''); }}
                        placeholder="Enter PIN"
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-center text-2xl text-white font-mono tracking-[0.5em] placeholder:text-white/20 placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all mb-4"
                    />
                    {error && <p className="text-red-400 text-sm text-center mb-4 font-medium">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-2xl transition-all text-lg"
                    >
                        Unlock Dashboard
                    </button>
                </form>

                <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
                    className="block text-center text-white/30 hover:text-white/60 text-sm mt-6 transition-colors">
                    ← Back to Website
                </a>
            </div>
        </div>
    );
}

// =============================================
// STAT CARD
// =============================================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`${color} p-2 rounded-xl`}>
                    <Icon size={18} className="text-white" />
                </div>
                <span className="text-white/40 text-sm font-medium">{label}</span>
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
        </div>
    );
}

// =============================================
// ORDERS TABLE
// =============================================
function OrdersSection({ orders, onRefresh, onStatusChange }: {
    orders: Order[];
    onRefresh: () => void;
    onStatusChange: (id: string, status: string) => void;
}) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    const loadOrderItems = async (orderId: string) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
            return;
        }
        try {
            const res = await fetch(`/api/orders/${orderId}/items`);
            const items = await res.json();
            setOrderItems(items);
            setExpandedOrder(orderId);
        } catch { setExpandedOrder(null); }
    };

    const statusColors: Record<string, string> = {
        'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Preparing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">📦 Orders</h2>
                <button onClick={onRefresh} className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white p-2 rounded-xl transition-all">
                    <RefreshCw size={18} />
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white/5 rounded-2xl p-8 text-center">
                    <Package size={40} className="text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 font-medium">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => loadOrderItems(order.id)}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-bold text-sm">{order.id}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-white/60 text-sm truncate">{order.customer_name}</p>
                                    <p className="text-white/30 text-xs">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-amber-400 font-black text-lg">₹{order.total_amount}</p>
                                    <p className="text-white/30 text-xs">{order.payment_method}</p>
                                </div>
                            </div>

                            {/* Expanded order items */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-white/5 p-4 bg-white/[0.02]">
                                    <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-3">Order Items</p>
                                    {orderItems.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm py-1.5">
                                            <span className="text-white/70">{item.item_name} <span className="text-white/30">x{item.quantity}</span></span>
                                            <span className="text-white/50">₹{item.price}</span>
                                        </div>
                                    ))}
                                    <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                                        {['Pending', 'Preparing', 'Completed', 'Cancelled'].map(status => (
                                            <button
                                                key={status}
                                                onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, status); }}
                                                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${order.status === status
                                                    ? 'bg-amber-500 text-black'
                                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// =============================================
// MENU MANAGEMENT
// =============================================
function MenuSection({ menuItems, onToggle, onRefresh, onDelete, onAdd }: {
    menuItems: AdminMenuItem[];
    onToggle: (id: string, available: boolean) => void;
    onRefresh: () => void;
    onDelete: (id: string) => void;
    onAdd: (item: { name: string; price: string; category: string; description: string; image?: string }) => void;
}) {
    const basePath = (import.meta as any).env?.BASE_URL || '/';
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Combos', description: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAdd = async () => {
        if (!newItem.name || !newItem.price) return;
        setUploading(true);

        let imagePath = '/menu/default.png';
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            try {
                const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.path) imagePath = data.path;
            } catch { /* use default */ }
        }

        onAdd({ ...newItem, image: imagePath });
        setNewItem({ name: '', price: '', category: 'Combos', description: '' });
        setImageFile(null);
        setImagePreview('');
        setShowAddForm(false);
        setUploading(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">🍳 Menu Items</h2>
                <div className="flex gap-2">
                    <button onClick={() => setShowAddForm(!showAddForm)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${showAddForm ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}>
                        <Plus size={14} /> {showAddForm ? 'Cancel' : 'Add Item'}
                    </button>
                    <button onClick={onRefresh} className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white p-2 rounded-xl transition-all">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="bg-white/5 rounded-2xl p-4 border border-amber-500/20 mb-4 space-y-3">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Add New Menu Item</p>

                    {/* Image Upload */}
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer flex-shrink-0">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500/40" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-amber-500/50 transition-colors">
                                    <Plus size={16} className="text-white/30" />
                                    <span className="text-[9px] text-white/20 mt-0.5">Photo</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        </label>
                        <input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Item name" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-500" />
                    </div>

                    <div className="flex gap-2">
                        <input value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            placeholder="₹ Price" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-500" />
                        <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                            {['Combos', 'Healthy Plates', 'Salads', 'Pasta', 'Street Bites', 'Beverages'].map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                        </select>
                    </div>
                    <input value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Description (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-amber-500" />
                    <button onClick={handleAdd} disabled={uploading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-xl transition-all text-sm disabled:opacity-50">
                        {uploading ? 'Uploading...' : 'Add to Menu'}
                    </button>
                </div>
            )}

            <div className="space-y-2">
                {menuItems.map(item => {
                    const imgSrc = item.image.startsWith('/menu/')
                        ? `${basePath}${item.image.slice(1)}`
                        : item.image;

                    return (
                        <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.available
                            ? 'bg-white/5 border-white/5'
                            : 'bg-red-500/5 border-red-500/10 opacity-60'
                            }`}>
                            <img src={imgSrc} alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">{item.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400 text-sm font-black">{item.price}</span>
                                    <span className="text-white/20 text-xs">•</span>
                                    <span className="text-white/30 text-xs">{item.category}</span>
                                </div>
                            </div>
                            <button onClick={() => onToggle(item.id, !item.available)}
                                className={`p-2 rounded-xl transition-all ${item.available ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                title={item.available ? 'Mark as Out of Stock' : 'Mark as Available'}>
                                {item.available ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button onClick={() => { if (confirm(`Delete "${item.name}"?`)) onDelete(item.id); }}
                                className="p-2 rounded-xl bg-white/5 text-white/20 hover:bg-red-500/20 hover:text-red-400 transition-all" title="Delete item">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// =============================================
// REPORT SECTION
// =============================================
interface ReportData {
    bestSellers: { item_name: string; total_qty: number; total_revenue: number }[];
    peakHours: { hour: string; count: number }[];
    dailyTotals: { date: string; orders: number; revenue: number }[];
}

function ReportSection() {
    const [report, setReport] = useState<ReportData | null>(null);

    useEffect(() => {
        fetch('/api/admin/report').then(r => r.json()).then(setReport).catch(() => { });
    }, []);

    if (!report) return <div className="text-center py-8 text-white/30">Loading report...</div>;

    return (
        <div className="space-y-6">
            {/* Best Sellers */}
            <div>
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Star size={18} className="text-amber-400" /> Best Sellers</h3>
                <div className="space-y-2">
                    {report.bestSellers.length === 0 ? (
                        <p className="text-white/30 text-sm">No sales data yet</p>
                    ) : report.bestSellers.map((item, i) => (
                        <div key={item.item_name} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/40'}`}>#{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">{item.item_name}</p>
                                <p className="text-white/30 text-xs">{item.total_qty} sold</p>
                            </div>
                            <span className="text-amber-400 font-black text-sm">₹{item.total_revenue}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Peak Hours */}
            <div>
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Timer size={18} className="text-blue-400" /> Peak Hours</h3>
                <div className="grid grid-cols-4 gap-2">
                    {report.peakHours.slice(0, 8).map(h => (
                        <div key={h.hour} className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-white font-bold text-sm">{parseInt(h.hour) > 12 ? `${parseInt(h.hour) - 12}PM` : `${parseInt(h.hour)}AM`}</p>
                            <p className="text-amber-400 font-black">{h.count}</p>
                            <p className="text-white/30 text-[10px]">orders</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7-Day Revenue */}
            <div>
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-green-400" /> Last 7 Days</h3>
                <div className="space-y-2">
                    {report.dailyTotals.length === 0 ? (
                        <p className="text-white/30 text-sm">No data yet</p>
                    ) : report.dailyTotals.map(d => (
                        <div key={d.date} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                            <span className="text-white/40 text-sm font-mono w-24">{d.date}</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (d.revenue / Math.max(...report.dailyTotals.map(x => x.revenue), 1)) * 100)}%` }} />
                            </div>
                            <span className="text-white/60 text-xs">{d.orders} orders</span>
                            <span className="text-amber-400 font-black text-sm w-16 text-right">₹{d.revenue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// =============================================
// MAIN ADMIN DASHBOARD
// =============================================
export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'report'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
    const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, todayOrders: 0, todayRevenue: 0, cancelledOrders: 0 });
    const [soundEnabled, setSoundEnabled] = useState(true);
    const prevOrderCountRef = useRef<number>(0);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            // Play sound if new orders arrived
            if (soundEnabled && prevOrderCountRef.current > 0 && data.length > prevOrderCountRef.current) {
                playNotificationSound();
            }
            prevOrderCountRef.current = data.length;
            setOrders(data);
        } catch { /* silent */ }
    }, [soundEnabled]);

    const fetchMenu = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/menu');
            setMenuItems(await res.json());
        } catch { /* silent */ }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/stats');
            setStats(await res.json());
        } catch { /* silent */ }
    }, []);

    const refreshAll = useCallback(() => {
        fetchOrders();
        fetchMenu();
        fetchStats();
    }, [fetchOrders, fetchMenu, fetchStats]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshAll();
            // Auto-refresh every 30 seconds
            const interval = setInterval(refreshAll, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, refreshAll]);

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
            await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchOrders();
            fetchStats();
        } catch { /* silent */ }
    };

    const handleMenuToggle = async (itemId: string, available: boolean) => {
        try {
            await fetch(`/api/admin/menu/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ available })
            });
            fetchMenu();
        } catch { /* silent */ }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await fetch(`/api/admin/menu/${itemId}`, { method: 'DELETE' });
            fetchMenu();
        } catch { /* silent */ }
    };

    const handleAddItem = async (item: { name: string; price: string; category: string; description: string; image?: string }) => {
        try {
            await fetch('/api/admin/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            fetchMenu();
        } catch { /* silent */ }
    };

    const handleAutoCancel = async () => {
        try {
            const res = await fetch('/api/admin/auto-cancel', { method: 'POST' });
            const data = await res.json();
            if (data.cancelledCount > 0) {
                alert(`Auto-cancelled ${data.cancelledCount} stale order(s)`);
                refreshAll();
            } else {
                alert('No stale orders to cancel');
            }
        } catch { /* silent */ }
    };

    const handleExportCSV = () => {
        window.open('/api/admin/orders/export', '_blank');
    };

    if (!isAuthenticated) {
        return <PinLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🥚</span>
                        <h1 className="text-lg font-black text-white">Eggzilla Admin</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-2 rounded-xl transition-all ${soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}
                            title={soundEnabled ? 'Sound ON — click to mute' : 'Sound OFF — click to unmute'}>
                            {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                        </button>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }}
                            className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white p-2 rounded-xl transition-all" title="Back to Website">
                            <ArrowLeft size={18} />
                        </a>
                        <button onClick={() => setIsAuthenticated(false)}
                            className="bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 p-2 rounded-xl transition-all" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <StatCard icon={Package} label="Today's Orders" value={stats.todayOrders} color="bg-blue-500" />
                    <StatCard icon={IndianRupee} label="Today's Revenue" value={`₹${stats.todayRevenue}`} color="bg-green-500" />
                    <StatCard icon={Clock} label="Pending" value={stats.pendingOrders} color="bg-yellow-500" />
                    <StatCard icon={ChefHat} label="Total Orders" value={stats.totalOrders} color="bg-purple-500" />
                    <StatCard icon={Ban} label="Cancelled" value={stats.cancelledOrders} color="bg-red-500" />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap">
                    <button onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                    <button onClick={handleAutoCancel}
                        className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <Timer size={14} /> Auto-Cancel Stale
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white/5 p-1 rounded-2xl">
                    {(['orders', 'menu', 'report'] as const).map(tab => (
                        <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-amber-500 text-black' : 'text-white/40 hover:text-white/70'}`}>
                            {tab === 'orders' ? `📦 Orders (${orders.length})` : tab === 'menu' ? `🍳 Menu (${menuItems.length})` : '📊 Report'}
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                {activeTab === 'orders' ? (
                    <OrdersSection orders={orders} onRefresh={() => { fetchOrders(); fetchStats(); }} onStatusChange={handleStatusChange} />
                ) : activeTab === 'menu' ? (
                    <MenuSection menuItems={menuItems} onToggle={handleMenuToggle} onRefresh={fetchMenu} onDelete={handleDeleteItem} onAdd={handleAddItem} />
                ) : (
                    <ReportSection />
                )}
            </div>
        </div>
    );
}
