class PaymentProcessor{
    static isBankTransfer(paymentData) {
        return paymentData.payment_type_id === 'bank_transfer' && 
               (paymentData.payment_method_id === 'cvu' || 
               paymentData.payment_method_id === 'cbu');
    }

    static isApproved(paymentData) {
        return paymentData.status === 'approved';
    }

    static extractPaymentInfo(paymentData) {
        return {
            id: paymentData.id,
            amount: paymentData.transaction_amount,
            currency: paymentData.currency_id,
            date: paymentData.date_created,
            email: paymentData.payer.email,
            description: paymentData.description,
            paymentMethod: paymentData.payment_method.type,
            status: paymentData.status,
            statusDetail: paymentData.status_detail,
            bankTransferId: paymentData.transaction_details?.bank_transfer_id,
            netAmount: paymentData.transaction_details?.net_received_amount,
            payerIdentification: paymentData.payer.identification?.number,
            payerIdentificationType: paymentData.payer.identification?.type
        };
    }

    static validatePaymentData(paymentData) {
        const requiredFields = ['id', 'transaction_amount', 'status', 'payment_type_id'];
        
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                throw new Error(`Campo requerido faltante: ${field}`);
            }
        }

        return true;
    }

}

module.exports = PaymentProcessor;