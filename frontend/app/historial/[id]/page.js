'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getSesionesByGrupo, getAsistenciaBySesion, getJugadoresByGrupo } from '@/lib/api'

export default function Historial() {
  const { id } = useParams()
  const [jugadores, setJugadores] = useState([])
  const [sesiones, setSesiones] = useState([])
  const [asistencias, setAsistencias] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const [jugadoresData, sesionesData] = await Promise.all([
        getJugadoresByGrupo(id),
        getSesionesByGrupo(id)
      ])
      setJugadores(jugadoresData)
      setSesiones(sesionesData)

      // Carga asistencia de cada sesión
      const asistenciasMap = {}
      await Promise.all(
        sesionesData.map(async sesion => {
          const data = await getAsistenciaBySesion(sesion.id)
          asistenciasMap[sesion.id] = data
        })
      )
      setAsistencias(asistenciasMap)
      setLoading(false)
    }
    cargar()
  }, [id])

  function estaPresente(sesionId, jugadorId) {
    const lista = asistencias[sesionId] || []
    const registro = lista.find(a => a.jugadorId === jugadorId)
    return registro ? registro.presente : null
  }

  function totalPresente(jugadorId) {
    return sesiones.filter(s => estaPresente(s.id, jugadorId) === true).length
  }

  function formatFecha(fecha) {
	  const soloFecha = fecha.split('T')[0]
	  const d = new Date(soloFecha + 'T12:00:00')
	  const dia = d.toLocaleDateString('es-CO', { weekday: 'short' })
	  const numero = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' })
	  return `${dia} ${numero}`
	}

	function formatFechaCSV(fecha) {
	  const soloFecha = fecha.split('T')[0]
	  const d = new Date(soloFecha + 'T12:00:00')
	  const dia = d.toLocaleDateString('es-CO', { weekday: 'short' })
	  const numero = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' })
	  return `${dia} ${numero}`
	}

  async function handleExportar() {
    const filas = [
      ['Jugador', ...sesiones.map(s => formatFechaCSV(s.fecha)), 'Total'].join(',')
    ]
    jugadores.forEach(j => {
      const fila = [
        j.nombre,
        ...sesiones.map(s => estaPresente(s.id, j.id) === true ? 'P' : 'A'),
        `${totalPresente(j.id)} de ${sesiones.length}`
      ]
      filas.push(fila.join(','))
    })
    const csv = filas.join('\n')
    const blob = new Blob(['\uFEFF' + csv, ], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistencia-grupo-${id}.csv`
    a.click()
  }

  if (loading) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-700 text-xl">Cargando...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">Historial</h1>
          <Link href="/" className="text-green-600 text-sm">← Volver</Link>
        </div>

        {sesiones.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-gray-500">No hay clases registradas aún.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-3 text-gray-600 font-medium">Jugador</th>
                    {sesiones.map(s => (
                      <th key={s.id} className="p-3 text-gray-600 font-medium text-center">
                        {formatFecha(s.fecha)}
                      </th>
                    ))}
                    <th className="p-3 text-gray-600 font-medium text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {jugadores.map((jugador, index) => (
                    <tr key={jugador.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-800">{jugador.nombre}</td>
                      {sesiones.map(s => (
                        <td key={s.id} className="p-3 text-center">
                          {estaPresente(s.id, jugador.id) === true ? '✅' : 
                           estaPresente(s.id, jugador.id) === false ? '❌' : '—'}
                        </td>
                      ))}
                      <td className="p-3 text-center font-semibold text-green-700">
                        {totalPresente(jugador.id)}/{sesiones.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleExportar}
              className="w-full bg-white border border-green-600 text-green-700 py-3 rounded-2xl font-semibold">
              Exportar CSV
            </button>
          </>
        )}
      </div>
    </main>
  )
}