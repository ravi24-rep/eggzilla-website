import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import db, { initDb } from './db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Serve uploaded menu images
const menuDir = path.resolve(__dirname, '..', 'public', 'menu');
if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true });
app.use('/menu', express.static(menuDir));

// File upload config
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, menuDir),
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        cb(null, allowed.includes(file.mimetype));
    },
});

// Initialize database
initDb();

// POST /api/admin/upload - Upload menu item image
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No image uploaded or invalid file type' });
        return;
    }
    const imagePath = `/menu/${req.file.filename}`;
    res.json({ success: true, path: imagePath });
});

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET /api/menu
app.get('/api/menu', (req, res) => {
    try {
        const rows: any[] = db.prepare('SELECT * FROM menu_items WHERE available = 1').all();
        const items = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            image: row.image,
            customizable: row.customizable === 1 ? true : undefined,
            options: row.options ? row.options.split(',') : undefined,
            bestseller: row.bestseller === 1 ? true : undefined,
        }));
        res.json(items);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, totalAmount, paymentMethod, items } = req.body;

    if (!customerName || !totalAmount || !items || !items.length) {
        res.status(400).json({ error: 'Missing required order fields' });
        return;
    }

    try {
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const insertTransaction = db.transaction(() => {
            const insertOrder = db.prepare(`
        INSERT INTO orders (id, customer_name, customer_phone, total_amount, payment_method)
        VALUES (?, ?, ?, ?, ?)
      `);
            insertOrder.run(orderId, customerName, customerPhone || '', totalAmount, paymentMethod || 'Cash');

            const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, item_name, quantity, price)
        VALUES (?, ?, ?, ?)
      `);
            for (const item of items) {
                insertItem.run(orderId, item.name, item.quantity || 1, item.price || 0);
            }
        });

        insertTransaction();

        res.status(201).json({ success: true, orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/track/:id - Public order tracking (limited info for customers)
app.get('/api/track/:id', (req, res) => {
    try {
        const order = db.prepare('SELECT id, customer_name, total_amount, status, payment_method, created_at FROM orders WHERE id = ?').get(req.params.id) as any;
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        const items = db.prepare('SELECT item_name, quantity, price FROM order_items WHERE order_id = ?').all(req.params.id);
        res.json({ ...order, items });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

app.get('/api/orders/:id/items', (req, res) => {
    try {
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
        res.json(items);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: 'Failed to fetch order items' });
    }
});

app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
    }
    try {
        db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

app.get('/api/admin/menu', (req, res) => {
    try {
        const rows: any[] = db.prepare('SELECT * FROM menu_items').all();
        const items = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            image: row.image,
            customizable: row.customizable === 1,
            options: row.options ? row.options.split(',') : [],
            bestseller: row.bestseller === 1,
            available: row.available === 1,
        }));
        res.json(items);
    } catch (error) {
        console.error('Error fetching admin menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// POST /api/admin/menu - Add new menu item
app.post('/api/admin/menu', (req, res) => {
    const { name, description, price, category, image, customizable, options, bestseller } = req.body;
    if (!name || !price || !category) {
        res.status(400).json({ error: 'Name, price, and category are required' });
        return;
    }
    try {
        const id = 'm' + Date.now();
        db.prepare(`INSERT INTO menu_items (id, name, description, price, category, image, customizable, options, bestseller, available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
            .run(id, name, description || '', price, category, image || '/menu/default.png', customizable ? 1 : 0, options || null, bestseller ? 1 : 0);
        res.status(201).json({ success: true, id });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Failed to add menu item' });
    }
});

// PUT /api/admin/menu/:id - Edit a menu item fully
app.put('/api/admin/menu/:id', (req, res) => {
    const { name, description, price, category, image, customizable, options, bestseller } = req.body;
    try {
        db.prepare(`UPDATE menu_items SET name=?, description=?, price=?, category=?, image=?, customizable=?, options=?, bestseller=? WHERE id=?`)
            .run(name, description, price, category, image, customizable ? 1 : 0, options || null, bestseller ? 1 : 0, req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error editing menu item:', error);
        res.status(500).json({ error: 'Failed to edit menu item' });
    }
});

// DELETE /api/admin/menu/:id - Delete a menu item
app.delete('/api/admin/menu/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

app.patch('/api/admin/menu/:id', (req, res) => {
    const { available, price } = req.body;
    try {
        if (available !== undefined) {
            db.prepare('UPDATE menu_items SET available = ? WHERE id = ?').run(available ? 1 : 0, req.params.id);
        }
        if (price !== undefined) {
            db.prepare('UPDATE menu_items SET price = ? WHERE id = ?').run(price, req.params.id);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { pin } = req.body;
    const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
    if (pin === ADMIN_PIN) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid PIN' });
    }
});

app.get('/api/admin/stats', (req, res) => {
    try {
        const totalOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status != 'Cancelled'").get() as any).count;
        const totalRevenue = (db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'Cancelled'").get() as any).total;
        const pendingOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'").get() as any).count;
        const todayOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = DATE('now') AND status != 'Cancelled'").get() as any).count;
        const todayRevenue = (db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE DATE(created_at) = DATE('now') AND status != 'Cancelled'").get() as any).total;
        const cancelledOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'").get() as any).count;
        res.json({ totalOrders, totalRevenue, pendingOrders, todayOrders, todayRevenue, cancelledOrders });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/admin/report - Daily sales report
app.get('/api/admin/report', (req, res) => {
    try {
        // Best selling items
        const bestSellers: any[] = db.prepare(`
            SELECT item_name, SUM(quantity) as total_qty, SUM(price * quantity) as total_revenue
            FROM order_items oi JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'Cancelled'
            GROUP BY item_name ORDER BY total_qty DESC LIMIT 10
        `).all();

        // Orders by hour (peak hours)
        const peakHours: any[] = db.prepare(`
            SELECT strftime('%H', created_at) as hour, COUNT(*) as count
            FROM orders WHERE status != 'Cancelled'
            GROUP BY hour ORDER BY count DESC
        `).all();

        // Daily totals for last 7 days
        const dailyTotals: any[] = db.prepare(`
            SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
            FROM orders WHERE status != 'Cancelled'
            GROUP BY date ORDER BY date DESC LIMIT 7
        `).all();

        res.json({ bestSellers, peakHours, dailyTotals });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// POST /api/admin/auto-cancel - Auto-cancel stale pending orders (older than 30 min)
app.post('/api/admin/auto-cancel', (req, res) => {
    try {
        const result = db.prepare(`
            UPDATE orders SET status = 'Cancelled'
            WHERE status = 'Pending' AND created_at < datetime('now', '-30 minutes')
        `).run();
        res.json({ success: true, cancelledCount: result.changes });
    } catch (error) {
        console.error('Error auto-cancelling:', error);
        res.status(500).json({ error: 'Failed to auto-cancel' });
    }
});

// GET /api/admin/orders/export - Export orders as CSV
app.get('/api/admin/orders/export', (req, res) => {
    try {
        const orders: any[] = db.prepare(`
            SELECT o.id, o.customer_name, o.customer_phone, o.total_amount, o.status, o.payment_method, o.created_at,
                   GROUP_CONCAT(oi.item_name || ' x' || oi.quantity, '; ') as items
            FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id ORDER BY o.created_at DESC
        `).all();

        let csv = 'Order ID,Customer,Phone,Amount,Status,Payment,Date,Items\n';
        for (const o of orders) {
            csv += `${o.id},"${o.customer_name}","${o.customer_phone || ''}",${o.total_amount},${o.status},${o.payment_method},"${o.created_at}","${o.items || ''}"\n`;
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=eggzilla-orders.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting orders:', error);
        res.status(500).json({ error: 'Failed to export orders' });
    }
});

// ==========================================
// SERVE FRONTEND
// ==========================================
async function startServer() {
    if (isProduction) {
        // PRODUCTION: Serve pre-built static files
        const distPath = path.resolve(__dirname, '..', 'dist');
        app.use(express.static(distPath));

        // SPA fallback — serve index.html for all non-API routes
        app.get('*', (req, res) => {
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(distPath, 'index.html'));
            }
        });

        app.listen(PORT, () => {
            console.log(`\n🥚 Eggzilla (PRODUCTION) running on http://localhost:${PORT}`);
            console.log(`🔐 Admin: http://localhost:${PORT}/#admin\n`);
        });
    } else {
        // DEVELOPMENT: Use Vite middleware for HMR
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
            root: path.resolve(__dirname, '..'),
        });

        app.use(vite.middlewares);

        app.listen(PORT, () => {
            console.log(`\n🥚 Eggzilla (DEV) running on http://localhost:${PORT}/`);
            console.log(`🔐 Admin: http://localhost:${PORT}/#admin`);
            console.log(`📡 API: http://localhost:${PORT}/api/health\n`);
        });
    }
}

startServer();
