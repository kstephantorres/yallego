const app = require('./src/app')

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📱 Bot de Telegram configurado`);
    console.log(`💰 Webhook de MercadoPago activo en /webhook/mercadopago`);
})


        




