const express = require('express')
const paymentController = require('./controllers/paymentController')

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.json({ 
        message: 'MercadoPago + Telegram Webhook Server',
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

app.post('/webhook/mercadopago', paymentController.handlePaymentNotification);

app.get('/test-telegram', paymentController.testTelegram);

module.exports = app;
