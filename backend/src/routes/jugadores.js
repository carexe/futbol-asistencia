const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Obtener jugadores de un grupo
router.get('/grupo/:grupoId', async (req, res) => {
  try {
    const jugadores = await prisma.jugador.findMany({
      where: { grupoId: parseInt(req.params.grupoId) },
      orderBy: { nombre: 'asc' }
    })
    res.json(jugadores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear jugador
router.post('/', async (req, res) => {
  try {
    const { nombre, grupoId } = req.body
    const jugador = await prisma.jugador.create({
      data: { nombre, grupoId }
    })
    res.json(jugador)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Eliminar jugador
router.delete('/:id', async (req, res) => {
  try {
    await prisma.jugador.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ mensaje: 'Jugador eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router