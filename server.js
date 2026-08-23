const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TOylEBNpycMl85';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'pH4S6S1unTuJu6i6PvTLyspI';

const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, planName } = req.body;

        const options = {
            amount: (amount || 499) * 100,
            currency: 'INR',
            receipt: `overloadfit_${Date.now()}`,
            notes: { plan: planName || 'Pro Membership' }
        };

        const order = await razorpay.orders.create(options);
        console.log(`[RAZORPAY] Order generated: ${order.id}`);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('[RAZORPAY] Order creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.error ? error.error.description : 'Failed to create order on Razorpay' 
        });
    }
});

app.post('/api/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing required signature params' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            console.log(`[RAZORPAY] Verified payment: ${razorpay_payment_id}`);
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully! Pro Plan Activated.',
                paymentId: razorpay_payment_id
            });
        } else {
            console.warn('[RAZORPAY] Signature mismatch for order:', razorpay_order_id);
            res.status(400).json({ success: false, message: 'Invalid payment signature!' });
        }
    } catch (err) {
        console.error('[RAZORPAY] Verification Error:', err);
        res.status(500).json({ success: false, message: 'Internal verification failure' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`⚡ OverloadFit Razorpay server listening at http://localhost:${PORT}`);
});