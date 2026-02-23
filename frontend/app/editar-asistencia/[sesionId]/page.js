'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAsistenciaBySesion, saveAsistencia, getJugadoresByGrupo } from '@/lib/api'

export default function EditarAsistencia() {
  const { sesionId } = useParams()
  const router = useRouter()
  const [jugadores, setJugadores] = useState([])
  const [presentes, setPresentes] = useState({})
  const [guardado, setGuardado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [grupoId, setGrupoId] = useState(null)
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    async function cargar() {
      const asistencia = await getAsistenciaBySesion(sesionId)
      if (asistencia.length > 0) {
        const gId = asistencia[0].jugador.grupoId
        setGrupoId(gId)
        const jugadoresData = await getJugadoresByGrupo(gId)
        setJugadores(jugadoresData)
        const map = {}
        asistencia.forEach(a => { map[a.jugadorId] = a.presente })
        setPresentes(map)
      }
      setLoading(false)
    }
    cargar()
  }, [sesionId])

  function togglePresente(jugadorId) {
    setPresentes(prev => ({ ...prev, [jugadorId]: !prev[jugadorId] }))
  }

  function marcarTodos(valor) {
    const nuevos = {}
    jugadores.forEach(j => { nuevos[j.id] = valor })
    setPresentes(nuevos)
  }

  async function handleGuardar() {
    setGuardando(true)
    const asistencias = jugadores.map(j => ({
      jugadorId: j.id,
      presente: presentes[j.id] ?? false
    }))
    await saveAsistencia(parseInt(sesionId), asistencias)
    setGuardando(false)
    setGuardado(true)
  }

  if (loading) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-700 text-xl">Cargando...</p>
    </main>
  )

  if (guardado) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-6xl mb-4">✅</p>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Asistencia actualizada</h2>
        <button
          onClick={() => router.back()}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
          Volver al historial
        </button>
      </div>
    </main>
  )

  const totalPresentes = Object.values(presentes).filter(Boolean).length

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">Editar Asistencia</h1>
          <button onClick={() => router.back()} className="text-green-600 text-sm">← Volver</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => marcarTodos(true)}
            className="flex-1 bg-green-100 text-green-700 py-2 rounded-xl text-sm font-medium">
            Todos presentes
          </button>
          <button
            onClick={() => marcarTodos(false)}
            className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-medium">
            Todos ausentes
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden mb-6">
          {jugadores.map((jugador, index) => (
            <div
              key={jugador.id}
              onClick={() => togglePresente(jugador.id)}
              className={`flex items-center justify-between p-4 cursor-pointer active:opacity-70 ${
                index !== jugadores.length - 1 ? 'border-b border-gray-100' : ''
              } ${presentes[jugador.id] ? 'bg-white' : 'bg-red-50'}`}>
              <span className={`font-medium ${presentes[jugador.id] ? 'text-gray-800' : 'text-red-400'}`}>
                {jugador.nombre}
              </span>
              <span className="text-2xl">
                {presentes[jugador.id] ? '✅' : '❌'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow mb-4 flex justify-between items-center">
          <span className="text-gray-600 text-sm">Presentes</span>
          <span className="font-bold text-green-700 text-lg">{totalPresentes} / {jugadores.length}</span>
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow active:opacity-70 disabled:opacity-50">
          {guardando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </main>
  )
}