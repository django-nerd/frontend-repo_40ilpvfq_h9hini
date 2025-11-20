import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [auth, setAuth] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="relative max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold">IT Provisioning Dashboard</h1>
          {auth && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span>{auth.nik}</span>
              <button onClick={() => setAuth(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">Keluar</button>
            </div>
          )}
        </header>

        {!auth ? (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">Selamat datang!</h2>
              <p className="text-slate-300">Masuk menggunakan NIK dan password default (mis. 12345) untuk mengakses dashboard instalasi dan aktivasi.</p>
              <ul className="text-slate-300 list-disc pl-5 text-sm">
                <li>Install paket software sesuai divisi</li>
                <li>Aktivasi Windows 11</li>
                <li>Aktivasi Office 2019</li>
              </ul>
            </div>
            <Login onLoggedIn={setAuth} />
          </div>
        ) : (
          <Dashboard auth={auth} />
        )}

        <footer className="text-center text-xs text-slate-400 mt-10">© {new Date().getFullYear()} IT Ops</footer>
      </div>
    </div>
  )
}

export default App
