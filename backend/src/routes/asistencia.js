const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Obtener asistencia de una sesión
router.get('/sesion/:sesionId', async (req, res) => {
  try {
    const asistencia = await prisma.asistencia.findMany({
      where: { sesionId: parseInt(req.params.sesionId) },
      include: { 
		  jugador: {
			include: { grupo: true }
		  }
		}
    })
    res.json(asistencia)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Guardar asistencia completa de una sesión
router.post('/sesion/:sesionId', async (req, res) => {
  try {
    const sesionId = parseInt(req.params.sesionId)
    const { asistencias } = req.body
    // asistencias = [{ jugadorId: 1, presente: true }, ...]

    // Borra la asistencia anterior de esa sesión si existe
    await prisma.asistencia.deleteMany({ where: { sesionId } })

    // Guarda la nueva
    await prisma.asistencia.createMany({
      data: asistencias.map(a => ({
        sesionId,
        jugadorId: a.jugadorId,
        presente: a.presente
      }))
    })

    res.json({ mensaje: 'Asistencia guardada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener resumen de asistencia de un jugador
router.get('/jugador/:jugadorId', async (req, res) => {
  try {
    const asistencias = await prisma.asistencia.findMany({
      where: { jugadorId: parseInt(req.params.jugadorId) },
      include: { sesion: true }
    })
    const total = asistencias.length
    const presentes = asistencias.filter(a => a.presente).length
    res.json({ total, presentes, asistencias })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router