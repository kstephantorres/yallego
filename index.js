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