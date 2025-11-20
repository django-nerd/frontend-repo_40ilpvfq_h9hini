import { useState } from 'react'

export default function Login({ onLoggedIn }) {
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik, password })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.detail || 'Login gagal')
      }
      const data = await res.json()
      onLoggedIn(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm w-full mx-auto bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Masuk Dashboard</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">NIK</label>
          <input value={nik} onChange={e=>setNik(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan NIK" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="12345" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="text-xs text-slate-300 mt-3">Tips: NIK demo EMP001, password 12345</p>
    </div>
  )
}
