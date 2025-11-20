import { useEffect, useMemo, useState } from 'react'

function Section({ title, children }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard({ auth }) {
  const backend = import.meta.env.VITE_BACKEND_URL
  const [divisions, setDivisions] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const headers = useMemo(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` }), [auth.token])

  useEffect(() => {
    async function load() {
      const res = await fetch(`${backend}/api/divisions`)
      const data = await res.json()
      setDivisions(data)
      refreshTasks()
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshTasks() {
    const res = await fetch(`${backend}/api/tasks`, { headers })
    const data = await res.json()
    setMyTasks(data)
  }

  async function createTask(type, payload) {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type, payload })
      })
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Gagal membuat task')
      }
      await refreshTasks()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const [selectedDivision, setSelectedDivision] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Halo, {auth.name || auth.nik}</h2>
          <p className="text-slate-300">Pilih aksi yang dibutuhkan untuk laptop baru.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Section title="Installasi paket software sesuai divisi">
          <div className="space-y-3">
            <select value={selectedDivision} onChange={e=>setSelectedDivision(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white">
              <option value="">Pilih divisi</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button disabled={!selectedDivision || loading} onClick={() => createTask('install_packages', { division: selectedDivision })} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium text-white">Buat Task Install</button>
          </div>
        </Section>

        <Section title="Aktivasi Windows 11">
          <p className="text-slate-300 mb-3">Khusus perangkat yang belum teraktivasi.</p>
          <button disabled={loading} onClick={() => createTask('activate_windows')} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium text-white">Buat Task Aktivasi</button>
        </Section>

        <Section title="Aktivasi Office 2019">
          <p className="text-slate-300 mb-3">Aktifkan lisensi Office 2019.</p>
          <button disabled={loading} onClick={() => createTask('activate_office')} className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors px-4 py-2 rounded-lg font-medium text-white">Buat Task Aktivasi</button>
        </Section>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-3">Daftar Task Saya</h3>
        <div className="space-y-2">
          {myTasks.length === 0 && <p className="text-slate-300">Belum ada task.</p>}
          {myTasks.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
              <div>
                <p className="font-medium capitalize">{t.type.replace('_',' ')}</p>
                {t.payload?.division && <p className="text-slate-300 text-sm">Divisi: {t.payload.division}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'done' ? 'bg-emerald-600/20 text-emerald-300' : t.status === 'failed' ? 'bg-rose-600/20 text-rose-300' : t.status === 'in_progress' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-slate-600/20 text-slate-300'}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
