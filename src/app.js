const express = require('express')
const paymentController = require('./controllers/paymentController')
const bodyParser = require('body-parser');

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.json({ 
        message: 'MercadoPago + Telegram Webhook Server',
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

app.post('/webhook/mercadopago', paymentController.handlePaymentNotification);
app.get('/test-telegram', paymentController.testTelegram);
app.get('/test-telegram', paymentController.testTelegram);
app.get('/test-payment', paymentController.testPaymentNotification);

module.exports = app;
