const express = require('express')

const {MercadoPagoConfig, Payment} = require('mercadopago')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res)=>{
    res.status(200).send('Servidor funcionando correctamente')
})

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})


const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    options: { timeout: 5000 }
})

const paymentService = new Payment(client);


app.post('/webhook/mercadopago', async (req, res) => { 
   
   res.status(200).send('Notificación recibida correctamente por el servidor.');

});
        




