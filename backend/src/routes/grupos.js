const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// Obtener todos los grupos
router.get('/', async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany({
      include: { profesor: true, horarios: true }
    })
    res.json(grupos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener grupos de un profesor
router.get('/profesor/:profesorId', async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany({
      where: { profesorId: parseInt(req.params.profesorId) },
      include: { horarios: true }
    })
    res.json(grupos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Crear grupo
router.post('/', async (req, res) => {
  try {
    const { nombre, profesorId, diasSemana } = req.body
    const grupo = await prisma.grupo.create({
      data: {
        nombre,
        profesorId,
        horarios: {
          create: diasSemana.map(dia => ({ diaSemana: dia }))
        }
      },
      include: { horarios: true }
    })
    res.json(grupo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router