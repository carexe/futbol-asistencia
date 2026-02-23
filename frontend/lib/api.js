const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProfesores() {
  const res = await fetch(`${API_URL}/api/profesores`)
  return res.json()
}

export async function createProfesor(nombre) {
  const res = await fetch(`${API_URL}/api/profesores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  })
  return res.json()
}

export async function getGruposByProfesor(profesorId) {
  const res = await fetch(`${API_URL}/api/grupos/profesor/${profesorId}`)
  return res.json()
}

export async function createGrupo(nombre, profesorId, diasSemana) {
  const res = await fetch(`${API_URL}/api/grupos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, profesorId, diasSemana })
  })
  return res.json()
}

export async function getJugadoresByGrupo(grupoId) {
  const res = await fetch(`${API_URL}/api/jugadores/grupo/${grupoId}`)
  return res.json()
}

export async function createJugador(nombre, grupoId) {
  const res = await fetch(`${API_URL}/api/jugadores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, grupoId })
  })
  return res.json()
}

export async function deleteJugador(id) {
  const res = await fetch(`${API_URL}/api/jugadores/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

export async function createSesion(grupoId, fecha) {
  const res = await fetch(`${API_URL}/api/sesiones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grupoId, fecha })
  })
  return res.json()
}

export async function getSesionesByGrupo(grupoId) {
  const res = await fetch(`${API_URL}/api/sesiones/grupo/${grupoId}`)
  return res.json()
}

export async function getAsistenciaBySesion(sesionId) {
  const res = await fetch(`${API_URL}/api/asistencia/sesion/${sesionId}`)
  return res.json()
}

export async function saveAsistencia(sesionId, asistencias) {
  const res = await fetch(`${API_URL}/api/asistencia/sesion/${sesionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asistencias })
  })
  return res.json()
}

export async function getAsistenciaByJugador(jugadorId) {
  const res = await fetch(`${API_URL}/api/asistencia/jugador/${jugadorId}`)
  return res.json()
}

export async function deleteSesion(id) {
  const res = await fetch(`${API_URL}/api/sesiones/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}