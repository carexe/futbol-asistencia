const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Obtener sesiones de un grupo
router.get('/grupo/:grupoId', async (req, res) => {
  try {
    const sesiones = await prisma.sesion.findMany({
      where: { grupoId: parseInt(req.params.grupoId) },
      orderBy: { fecha: 'desc' }
    })
    res.json(sesiones)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear sesión
router.post('/', async (req, res) => {
  try {
    const { grupoId, fecha } = req.body
    const sesion = await prisma.sesion.create({
      data: {
        grupoId,
        fecha: new Date(fecha)
      }
    })
    res.json(sesion)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router