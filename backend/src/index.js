const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/profesores', require('./routes/profesores'))
app.use('/api/grupos', require('./routes/grupos'))
app.use('/api/jugadores', require('./routes/jugadores'))
app.use('/api/sesiones', require('./routes/sesiones'))
app.use('/api/asistencia', require('./routes/asistencia'))

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})