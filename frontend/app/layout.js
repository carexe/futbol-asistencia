import './globals.css'

export const metadata = {
  title: 'Estudiantes del Fútbol',
  description: 'Somos más que un balón',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-red-700 text-white shadow-md">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <img src="/logo.webp" alt="Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Estudiantes del Fútbol</h1>
              <p className="text-red-200 text-xs">Somos más que un balón</p>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}