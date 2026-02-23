'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProfesores, createProfesor, createGrupo, createJugador, deleteJugador, getJugadoresByGrupo } from '@/lib/api'

export default function Admin() {
  const [profesores, setProfesores] = useState([])
  const [nombreProfesor, setNombreProfesor] = useState('')
  const [nombreGrupo, setNombreGrupo] = useState('')
  const [diasSemana, setDiasSemana] = useState([])
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null)
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [jugadores, setJugadores] = useState([])
  const [nombreJugador, setNombreJugador] = useState('')
  const [loading, setLoading] = useState(true)

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  useEffect(() => {
    cargarProfesores()
  }, [])

  async function cargarProfesores() {
    const data = await getProfesores()
    setProfesores(data)
    setLoading(false)
  }

  async function handleCrearProfesor() {
    if (!nombreProfesor.trim()) return
    await createProfesor(nombreProfesor.trim())
    setNombreProfesor('')
    cargarProfesores()
  }

  async function handleCrearGrupo() {
    if (!nombreGrupo.trim() || !profesorSeleccionado || diasSemana.length === 0) return
    await createGrupo(nombreGrupo.trim(), profesorSeleccionado, diasSemana)
    setNombreGrupo('')
    setDiasSemana([])
    cargarProfesores()
  }

  async function handleSeleccionarGrupo(grupo) {
    setGrupoSeleccionado(grupo)
    const data = await getJugadoresByGrupo(grupo.id)
    setJugadores(data)
  }

  async function handleCrearJugador() {
    if (!nombreJugador.trim() || !grupoSeleccionado) return
    await createJugador(nombreJugador.trim(), grupoSeleccionado.id)
    setNombreJugador('')
    handleSeleccionarGrupo(grupoSeleccionado)
  }

  async function handleEliminarJugador(id) {
    await deleteJugador(id)
    handleSeleccionarGrupo(grupoSeleccionado)
  }

  function toggleDia(dia) {
    setDiasSemana(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  if (loading) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-700 text-xl">Cargando...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">Administración</h1>
          <Link href="/" className="text-green-600 text-sm">← Volver</Link>
        </div>

        {/* Crear profesor */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Nuevo Profesor</h2>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              placeholder="Nombre del profesor"
              value={nombreProfesor}
              onChange={e => setNombreProfesor(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCrearProfesor()}
            />
            <button
              onClick={handleCrearProfesor}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Agregar
            </button>
          </div>
        </div>

        {/* Crear grupo */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Nuevo Grupo</h2>
          <select
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2"
            value={profesorSeleccionado || ''}
            onChange={e => setProfesorSeleccionado(parseInt(e.target.value))}>
            <option value="">Selecciona un profesor</option>
            {profesores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-2"
            placeholder="Nombre del grupo (ej: Sub-10)"
            value={nombreGrupo}
            onChange={e => setNombreGrupo(e.target.value)}
          />
          <p className="text-xs text-gray-500 mb-2">Días de entrenamiento:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {dias.map(dia => (
              <button
                key={dia}
                onClick={() => toggleDia(dia)}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  diasSemana.includes(dia)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}>
                {dia}
              </button>
            ))}
          </div>
          <button
            onClick={handleCrearGrupo}
            className="w-full bg-green-600 text-white py-2 rounded-xl text-sm font-semibold">
            Crear Grupo
          </button>
        </div>

        {/* Jugadores por grupo */}
        <div className="bg-white rounded-2xl p-4 shadow mb-4">
          <h2 className="font-semibold text-gray-700 mb-3">Jugadores</h2>
          <select
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"
            onChange={e => {
              const grupo = profesores.flatMap(p => p.grupos).find(g => g.id === parseInt(e.target.value))
              if (grupo) handleSeleccionarGrupo(grupo)
            }}>
            <option value="">Selecciona un grupo</option>
            {profesores.flatMap(p => p.grupos).map(g => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>

          {grupoSeleccionado && (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Nombre del jugador"
                  value={nombreJugador}
                  onChange={e => setNombreJugador(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCrearJugador()}
                />
                <button
                  onClick={handleCrearJugador}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Agregar
                </button>
              </div>
              {jugadores.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-2">Sin jugadores aún</p>
              ) : (
                jugadores.map(j => (
                  <div key={j.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{j.nombre}</span>
                    <button
                      onClick={() => handleEliminarJugador(j.id)}
                      className="text-red-400 text-xs hover:text-red-600">
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}