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

app.post('/webhook/mercadopago',(req, res)=>{
    console.log('Webhook recibido: ',req.body)
    res.status(200).send('OK')
})

const axios= require('axios')

const getPaymentDetails = (paymentId)=>{
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
