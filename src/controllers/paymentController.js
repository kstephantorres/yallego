const telegramService = require('../services/telegramService');
const PaymentProcessor = require('../utils/paymentProcessor');
const axios = require('axios');

// Crear una instancia del servicio
// const telegramService = new TelegramService();

class PaymentController {
    async handlePaymentNotification(req, res) {
        try {
            console.log('🔔 Webhook recibido de MercadoPago');
            console.log('Headers:', req.headers);
            console.log('Body:', JSON.stringify(req.body, null, 2));
            console.log('Query params:', req.query);

            // MercadoPago puede enviar notificaciones de diferentes formas
            let paymentId = null;
            let paymentData = null;

            // Caso 1: Datos en el body (webhook normal)
            if (req.body && req.body.id) {
                paymentData = req.body;
                paymentId = req.body.id;
                console.log('📦 Datos del pago recibidos en el body');
            }
            // Caso 2: Solo notificación con ID en query params
            else if (req.query && req.query.id) {
                paymentId = req.query.id;
                console.log('🔍 Solo ID recibido, obteniendo datos del pago...');
                
                // SOLUCIÓN: Usar paymentController en lugar de this
                paymentData = await paymentController.getPaymentDetails(paymentId);
            }
            // Caso 3: Notificación desde body.resource (formato típico de MercadoPago)
            else if (req.body && req.body.resource && req.body.topic === 'payment') {
                paymentId = req.body.resource;
                console.log('🔍 ID del pago obtenido desde body.resource:', paymentId);
                
                // SOLUCIÓN: Usar paymentController en lugar de this
                paymentData = await paymentController.getPaymentDetails(paymentId);
            }
            // Caso 4: Webhook de prueba (sin datos reales)
            else {
                console.log('🧪 Webhook de prueba detectado - sin datos de pago');
                
                // Responder exitosamente para el test
                return res.status(200).json({ 
                    status: 'ok',
                    message: 'Webhook de prueba procesado correctamente',
                    timestamp: new Date().toISOString()
                });
            }

            if (!paymentData) {
                throw new Error('No se pudieron obtener los datos del pago');
            }


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
                console.log(`   - Tipo: ${paymentData.payment_type_id}`);
                console.log(`   - Estado: ${paymentData.status}`);
            }

            // Responder a MercadoPago
            res.status(200).json({ 
                status: 'ok',
                message: 'Webhook procesado correctamente',
                payment_id: paymentId,
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

    async getPaymentDetails(paymentId) {
        try {
            const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
            
            if (!accessToken) {
                console.log('⚠️ No hay access token configurado, usando datos simulados');
                return this.createMockPaymentData(paymentId);
            }

            console.log(`🔄 Obteniendo detalles del pago ${paymentId}...`);
            
            const response = await axios.get(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Datos del pago obtenidos exitosamente');
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo datos del pago:', error.response?.data || error.message);
            
            // En caso de error, usar datos simulados para pruebas
            console.log('🔄 Usando datos simulados para continuar con la prueba');
            return this.createMockPaymentData(paymentId);
        }
    }

    createMockPaymentData(paymentId) {
        return {
            id: paymentId || 123456789,
            transaction_amount: 100.50,
            currency_id: "ARS",
            date_created: new Date().toISOString(),
            status: "approved",
            status_detail: "accredited",
            description: "Transferencia de prueba - Webhook Test",
            payment_method: {
                id: "cvu",
                type: "bank_transfer"
            },
            payment_type_id: "bank_transfer",
            payment_method_id: "cvu",
            payer: {
                email: "test@example.com",
                identification: {
                    number: "12345678901",
                    type: "CUIL"
                }
            },
            transaction_details: {
                bank_transfer_id: 987654321,
                net_received_amount: 100.50,
                financial_institution: "1"
            }
        };
    }

    async testTelegram(req, res) {
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

    // Nuevo endpoint para simular un pago real
    async testPaymentNotification(req, res) {
        try {
            console.log('🧪 Simulando notificación de pago...');
            
            // Datos simulados basados en tu ejemplo
            const mockPaymentData = {
                id: 113605012667,
                transaction_amount: 10.09,
                currency_id: "ARS",
                date_created: "2025-06-05T21:59:32.000-04:00",
                status: "approved",
                status_detail: "accredited",
                description: "Bank Transfer",
                payment_method: {
                    id: "cvu",
                    type: "bank_transfer"
                },
                payment_type_id: "bank_transfer",
                payment_method_id: "cvu",
                payer: {
                    email: "kevinmtorrez@gmail.com",
                    identification: {
                        number: "20376101836",
                        type: "CUIL"
                    }
                },
                transaction_details: {
                    bank_transfer_id: 115882990735,
                    net_received_amount: 10.09,
                    financial_institution: "1"
                }
            };

            // Procesar como si fuera un webhook real
            const message = telegramService.formatPaymentMessage(mockPaymentData);
            await telegramService.sendMessage(message);
            
            res.json({ 
                status: 'success',
                message: 'Notificación de pago simulada enviada a Telegram',
                payment_data: mockPaymentData
            });
            
        } catch (error) {
            res.status(500).json({ 
                status: 'error',
                message: error.message
            });
        }
    }
}

// Crear una instancia y exportarla
const paymentController = new PaymentController();
module.exports = paymentController;