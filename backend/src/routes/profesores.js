const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Obtener todos los profesores
router.get('/', async (req, res) => {
  try {
    const profesores = await prisma.profesor.findMany({
      include: { grupos: true }
    })
    res.json(profesores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear profesor
router.post('/', async (req, res) => {
  try {
    const { nombre } = req.body
    const profesor = await prisma.profesor.create({
      data: { nombre }
    })
    res.json(profesor)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router