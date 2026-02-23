'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getJugadoresByGrupo, createSesion, saveAsistencia } from '@/lib/api'

export default function Asistencia() {
  const { id } = useParams()
  const [jugadores, setJugadores] = useState([])
  const [presentes, setPresentes] = useState({})
  const [guardado, setGuardado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const hoy = new Date().toLocaleDateString('en-CA')

  useEffect(() => {
    getJugadoresByGrupo(id).then(data => {
      setJugadores(data)
      // Por defecto todos presentes
      const inicial = {}
      data.forEach(j => { inicial[j.id] = true })
      setPresentes(inicial)
      setLoading(false)
    })
  }, [id])

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
    const sesion = await createSesion(parseInt(id), hoy)
    const asistencias = jugadores.map(j => ({
      jugadorId: j.id,
      presente: presentes[j.id]
    }))
    await saveAsistencia(sesion.id, asistencias)
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
        <h2 className="text-2xl font-bold text-green-800 mb-2">Asistencia guardada</h2>
        <p className="text-green-600 mb-6">{hoy}</p>
        <Link href="/" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
          Volver al inicio
        </Link>
      </div>
    </main>
  )

  const totalPresentes = Object.values(presentes).filter(Boolean).length

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-green-800">Asistencia</h1>
          <Link href="/" className="text-green-600 text-sm">← Volver</Link>
        </div>
        <p className="text-green-600 text-sm mb-6">{hoy}</p>

        {/* Botones marcar todos */}
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

        {/* Lista de jugadores */}
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

        {/* Resumen y guardar */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4 flex justify-between items-center">
          <span className="text-gray-600 text-sm">Presentes</span>
          <span className="font-bold text-green-700 text-lg">{totalPresentes} / {jugadores.length}</span>
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow active:opacity-70 disabled:opacity-50">
          {guardando ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </div>
    </main>
  )
}