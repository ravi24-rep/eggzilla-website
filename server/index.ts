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
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, '..', 'public');
const menuDir = path.resolve(dataDir, 'menu');
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
app.get('/api/menu', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM menu_items WHERE available = 1');
        const items = result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            image: row.image,
            customizable: row.customizable === 1 ? true : undefined,
            options: row.options ? row.options.toString().split(',') : undefined,
            bestseller: row.bestseller === 1 ? true : undefined,
        }));
        res.json(items);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// GET /api/orders
app.get('/api/orders', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
    const { customerName, customerPhone, totalAmount, paymentMethod, items } = req.body;

    if (!customerName || !totalAmount || !items || !items.length) {
        res.status(400).json({ error: 'Missing required order fields' });
        return;
    }

    try {
        // --- Validation: Check availability of all items before processing ---
        for (const item of items) {
            if (item.id) {
                const check = await db.execute({
                    sql: 'SELECT available, name FROM menu_items WHERE id = ?',
                    args: [item.id]
                });
                if (check.rows.length === 0 || check.rows[0].available === 0) {
                    res.status(400).json({
                        error: `Sorry, ${check.rows.length ? check.rows[0].name : item.name} just sold out! It has been removed from your plate.`,
                        soldOutItemId: item.id
                    });
                    return;
                }
            }
        }

        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const tx = await db.transaction();
        try {
            await tx.execute({
                sql: `INSERT INTO orders (id, customer_name, customer_phone, total_amount, payment_method) VALUES (?, ?, ?, ?, ?)`,
                args: [orderId, customerName, customerPhone || '', totalAmount, paymentMethod || 'Cash']
            });

            for (const item of items) {
                await tx.execute({
                    sql: `INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)`,
                    args: [orderId, item.name, item.quantity || 1, item.price || 0]
                });
            }
            await tx.commit();
        } catch (e) {
            await tx.rollback();
            throw e;
        }

        res.status(201).json({ success: true, orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/track/:id
app.get('/api/track/:id', async (req, res) => {
    try {
        const orderRes = await db.execute({
            sql: 'SELECT id, customer_name, total_amount, status, payment_method, created_at FROM orders WHERE id = ?',
            args: [req.params.id]
        });
        const order = orderRes.rows[0] as any;
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        const itemsRes = await db.execute({
            sql: 'SELECT item_name, quantity, price FROM order_items WHERE order_id = ?',
            args: [req.params.id]
        });
        res.json({ ...order, items: itemsRes.rows });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ error: 'Failed to track order' });
    }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

app.get('/api/orders/:id/items', async (req, res) => {
    try {
        const items = await db.execute({
            sql: 'SELECT * FROM order_items WHERE order_id = ?',
            args: [req.params.id]
        });
        res.json(items.rows);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: 'Failed to fetch order items' });
    }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
    }
    try {
        await db.execute({
            sql: 'UPDATE orders SET status = ? WHERE id = ?',
            args: [status, req.params.id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

app.get('/api/admin/menu', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM menu_items');
        const items = result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            image: row.image,
            customizable: row.customizable === 1,
            options: row.options ? row.options.toString().split(',') : [],
            bestseller: row.bestseller === 1,
            available: row.available === 1,
        }));
        res.json(items);
    } catch (error) {
        console.error('Error fetching admin menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// POST /api/admin/menu
app.post('/api/admin/menu', async (req, res) => {
    const { name, description, price, category, image, customizable, options, bestseller } = req.body;
    if (!name || !price || !category) {
        res.status(400).json({ error: 'Name, price, and category are required' });
        return;
    }
    try {
        const id = 'm' + Date.now();
        await db.execute({
            sql: `INSERT INTO menu_items (id, name, description, price, category, image, customizable, options, bestseller, available)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            args: [id, name, description || '', price, category, image || '/menu/default.png', customizable ? 1 : 0, options || null, bestseller ? 1 : 0]
        });
        res.status(201).json({ success: true, id });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Failed to add menu item' });
    }
});

// PUT /api/admin/menu/:id
app.put('/api/admin/menu/:id', async (req, res) => {
    const { name, description, price, category, image, customizable, options, bestseller } = req.body;
    try {
        await db.execute({
            sql: `UPDATE menu_items SET name=?, description=?, price=?, category=?, image=?, customizable=?, options=?, bestseller=? WHERE id=?`,
            args: [name, description, price, category, image, customizable ? 1 : 0, options || null, bestseller ? 1 : 0, req.params.id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error editing menu item:', error);
        res.status(500).json({ error: 'Failed to edit menu item' });
    }
});

// DELETE /api/admin/menu/:id
app.delete('/api/admin/menu/:id', async (req, res) => {
    try {
        await db.execute({
            sql: 'DELETE FROM menu_items WHERE id = ?',
            args: [req.params.id]
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

app.patch('/api/admin/menu/:id', async (req, res) => {
    const { available, price } = req.body;
    try {
        if (available !== undefined) {
            await db.execute({
                sql: 'UPDATE menu_items SET available = ? WHERE id = ?',
                args: [available ? 1 : 0, req.params.id]
            });
        }
        if (price !== undefined) {
            await db.execute({
                sql: 'UPDATE menu_items SET price = ? WHERE id = ?',
                args: [price, req.params.id]
            });
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

app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalOrdersRes = await db.execute("SELECT COUNT(*) as count FROM orders WHERE status != 'Cancelled'");
        const totalRevenueRes = await db.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'Cancelled'");
        const pendingOrdersRes = await db.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'Pending'");
        const todayOrdersRes = await db.execute("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = DATE('now') AND status != 'Cancelled'");
        const todayRevenueRes = await db.execute("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE DATE(created_at) = DATE('now') AND status != 'Cancelled'");
        const cancelledOrdersRes = await db.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'Cancelled'");

        res.json({
            totalOrders: totalOrdersRes.rows[0].count,
            totalRevenue: totalRevenueRes.rows[0].total,
            pendingOrders: pendingOrdersRes.rows[0].count,
            todayOrders: todayOrdersRes.rows[0].count,
            todayRevenue: todayRevenueRes.rows[0].total,
            cancelledOrders: cancelledOrdersRes.rows[0].count
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/admin/report
app.get('/api/admin/report', async (req, res) => {
    try {
        const bestSellers = await db.execute(`
            SELECT item_name, SUM(quantity) as total_qty, SUM(price * quantity) as total_revenue
            FROM order_items oi JOIN orders o ON oi.order_id = o.id
            WHERE o.status != 'Cancelled'
            GROUP BY item_name ORDER BY total_qty DESC LIMIT 10
        `);

        const peakHours = await db.execute(`
            SELECT strftime('%H', created_at) as hour, COUNT(*) as count
            FROM orders WHERE status != 'Cancelled'
            GROUP BY hour ORDER BY count DESC
        `);

        const dailyTotals = await db.execute(`
            SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
            FROM orders WHERE status != 'Cancelled'
            GROUP BY date ORDER BY date DESC LIMIT 7
        `);

        res.json({
            bestSellers: bestSellers.rows,
            peakHours: peakHours.rows,
            dailyTotals: dailyTotals.rows
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// POST /api/admin/auto-cancel
app.post('/api/admin/auto-cancel', async (req, res) => {
    try {
        const result = await db.execute(`
            UPDATE orders SET status = 'Cancelled'
            WHERE status = 'Pending' AND created_at < datetime('now', '-30 minutes')
        `);
        res.json({ success: true, cancelledCount: result.rowsAffected });
    } catch (error) {
        console.error('Error auto-cancelling:', error);
        res.status(500).json({ error: 'Failed to auto-cancel' });
    }
});

// GET /api/admin/orders/export
app.get('/api/admin/orders/export', async (req, res) => {
    try {
        const result = await db.execute(`
            SELECT o.id, o.customer_name, o.customer_phone, o.total_amount, o.status, o.payment_method, o.created_at,
                   GROUP_CONCAT(oi.item_name || ' x' || oi.quantity, '; ') as items
            FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id ORDER BY o.created_at DESC
        `);

        let csv = 'Order ID,Customer,Phone,Amount,Status,Payment,Date,Items\n';
        for (const o of result.rows as any[]) {
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
    // Initialize the remote Turso DB gracefully on boot
    await initDb();

    if (isProduction) {
        const distPath = path.resolve(__dirname, '..', 'dist');
        app.use(express.static(distPath));

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
