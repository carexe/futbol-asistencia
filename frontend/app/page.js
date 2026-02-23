'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProfesores } from '@/lib/api'

export default function Home() {
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfesores().then(data => {
      setProfesores(data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-700 text-xl">Cargando...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-2">⚽ Asistencia</h1>
        <p className="text-green-600 mb-8">Escuela de Fútbol</p>

        {profesores.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-gray-500 mb-4">No hay profesores registrados aún.</p>
            <Link href="/admin" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
              Ir a Administración
            </Link>
          </div>
        ) : (
          <>
            {profesores.map(profesor => (
              <div key={profesor.id} className="mb-6">
                <h2 className="text-lg font-semibold text-green-700 mb-3">{profesor.nombre}</h2>
                {profesor.grupos.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin grupos asignados</p>
                ) : (
                  profesor.grupos.map(grupo => (
                    <div key={grupo.id} className="bg-white rounded-2xl p-4 shadow mb-3 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{grupo.nombre}</span>
                      <div className="flex gap-2">
                        <Link href={`/asistencia/${grupo.id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                          Asistencia
                        </Link>
                        <Link href={`/historial/${grupo.id}`}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold">
                          Historial
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
            <Link href="/admin" className="block text-center text-green-600 mt-4 text-sm">
              Administración →
            </Link>
          </>
        )}
      </div>
    </main>
  )
}