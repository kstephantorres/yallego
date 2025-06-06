const app = require('./src/app')

const PORT = process.env.PORT || 3001

// app.use(express.json())

app.listen(PORT, ()=>{
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📱 Bot de Telegram configurado`);
    console.log(`💰 Webhook de MercadoPago activo en /webhook/mercadopago`);
})





app.post('/webhook/mercadopago', async (req, res) => { 
   
   res.status(200).send('Notificación recibida correctamente por el servidor.');

});
        




