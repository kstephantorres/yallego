const express = require('express')
const bodyParse = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3001

app.use(bodyParse.json())

app.get('/health', (req, res)=>{
    res.status(200).send('Servidor funcionando correctamente')
})

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.post('/webhook/mercadopago', async (req, res)=>{
    try {
        const data = req.body

        if(data.type === 'payment' && data.action === 'payment.created')
        {
            console.log('Nueva transferencia recibida: ', data)

            const paymentId = data.data.id
            const paymentDetails = await getPaymentDetails(paymentId)

            if(paymentDetails){
                // console.log('Detalle del pago: ', paymentDetails)
                await sendWhatsAppNotification(paymentDetails)
            }

        }
        console.log('Webhook recibido... ')
        res.status(200).send('OK')
    } catch (error) {
        console.error('Error procesando el webhook: ',error)
        res.status(500).send('Error procesando el webhook')
    }
})

const axios= require('axios')

const getPaymentDetails = async (paymentId)=>{
    try {
        console.log(`Obteniendo detalles del pago ${paymentId}...`)
        return {
      id: paymentId,
      transaction_amount: 1500,
      currency_id: "ARS",
      payer: {
        first_name: "Juan",
        last_name: "Pérez"
      },
      date_created: new Date().toISOString()
        }
    } catch (error) {
        console.log('Error: ', error)
        return null
    }
}

const sendWhatsAppNotification = async (paymentDetails) => {
    const amount = paymentDetails.transaction_amount
    const currency = paymentDetails.currency_id
    const senderName = paymentDetails.payer.first_name + " "+ paymentDetails.payer.last_name 
    const date = new Date(paymentDetails.date_created).toLocaleDateString

    const message = `💰 *Nueva transferencia recibida*\n\n
    Monto: ${amount} ${currency}\n
    De: ${senderName}\n
    Fecha: ${date}\n
    ID: ${paymentDetails.id}
    `
    console.log('📱 MENSAJE DE WHATSAPP:');
    console.log(message);
    return true
}


