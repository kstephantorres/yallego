const telegramService = require('../services/telegramService');
const PaymentProcessor = require('../utils/paymentProcessor');

class PaymentController{

    async handlePaymentNotification(req, res){
        try {
            console.log('🔔 Webhook recibido de MercadoPago');
            console.log('Headers:', req.headers);
            console.log('Body:', JSON.stringify(req.body, null, 2));

            const paymentData = req.body;

            // Validar datos del pago
            PaymentProcessor.validatePaymentData(paymentData);

            // Verificar si es una transferencia bancaria aprobada
            if (PaymentProcessor.isBankTransfer(paymentData) && 
                PaymentProcessor.isApproved(paymentData)) {
                
                console.log('💰 Transferencia bancaria aprobada detectada');
                
                // Formatear y enviar mensaje a Telegram
                const message = telegramService.formatPaymentMessage(paymentData);
                await telegramService.sendMessage(message);
                
                console.log('✅ Notificación enviada exitosamente');
            } else {
                console.log('ℹ️ Pago no es transferencia bancaria o no está aprobado');
            }

            // Responder a MercadoPago
            res.status(200).json({ 
                status: 'ok',
                message: 'Webhook procesado correctamente',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Error procesando webhook:', error);
            
            res.status(500).json({ 
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    async testTelegram(req, res){
        try {
            const testMessage = `
                🧪 <b>MENSAJE DE PRUEBA</b>

                Este es un mensaje de prueba del sistema de notificaciones.

                ⏰ <i>Enviado: ${new Date().toLocaleString('es-AR')}</i>
                `.trim();

            await telegramService.sendMessage(testMessage);
            
            res.json({ 
                status: 'success',
                message: 'Mensaje de prueba enviado a Telegram'
            });
        } catch (error) {
            res.status(500).json({ 
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController();
