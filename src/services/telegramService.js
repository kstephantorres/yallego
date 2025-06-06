const axios = require('axios')

class TelegramService {
    constructor(){
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    }
    async sendMessage(message){
        try {
            const response = await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });

            console.log('✅ Mensaje enviado a Telegram');
            return response.data;
        } catch (error) {
            console.error('❌ Error enviando mensaje a Telegram:', error.response?.data || error.message);
            throw error;
        }
    }
    formatPaymentMessage(paymentData){
        const {
            id,
            transaction_amount,
            currency_id,
            date_created,
            status,
            status_detail,
            description,
            payment_method,
            payer,
            transaction_details
        } = paymentData;

        return `
            🏦 <b>NUEVA TRANSFERENCIA BANCARIA</b>

            💰 <b>Importe:</b> ${currency_id} $${transaction_amount}
            📅 <b>Fecha:</b> ${new Date(date_created).toLocaleString('es-AR')}
            📧 <b>Email:</b> ${payer.email || 'No disponible'}
            🆔 <b>ID Pago:</b> ${id}
            📝 <b>Descripción:</b> ${description}
            💳 <b>Método:</b> ${payment_method.type} (${payment_method.id})
            ✅ <b>Estado:</b> ${status} - ${status_detail}

            🏦 <b>Detalles Bancarios:</b>
            - ID Transferencia: ${transaction_details.bank_transfer_id}
            - Monto Neto: ${currency_id} $${transaction_details.net_received_amount}
            - Institución: ${transaction_details.financial_institution}

            ${payer.identification?.number ? `🪪 <b>CUIL:</b> ${payer.identification.number}` : ''}

            ⏰ <i>Procesado: ${new Date().toLocaleString('es-AR')}</i>
            `.trim();
    }
}

module.exports = new TelegramService();