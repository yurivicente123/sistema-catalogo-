import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order (Silent)
router.post('/', async (req, res) => {
    const { total_price, customer_notes, items } = req.body;
    try {
        const { data, error } = await db.from('orders').insert([
            { 
                total_price: parseFloat(total_price), 
                customer_notes, 
                items,
                status: 'pendente'
            }
        ]).select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const { data, error } = await db.from('orders').update({ status }).eq('id', req.params.id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Stats for Financial Dashboard
router.get('/stats', async (req, res) => {
    try {
        // Fechados only for total revenue
        const { data: closedOrders, error: orderError } = await db
            .from('orders')
            .select('*')
            .eq('status', 'fechado');
        
        if (orderError) throw orderError;

        // Calculate Revenue
        const totalRevenue = closedOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

        // Product Frequency
        const productStats = {};
        closedOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productStats[item.nome]) productStats[item.nome] = 0;
                productStats[item.nome] += item.quantity;
            });
        });

        res.json({
            totalRevenue,
            totalSales: closedOrders.length,
            productStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
