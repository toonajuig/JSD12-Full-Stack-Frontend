import { useState } from 'react'
import AuthPanel from './components/AuthPanel'
import MongoPanel from './components/MongoPanel'
import SupabasePanel from './components/SupabasePanel'

const TABS = [
  { id: 'auth', label: 'Auth' },
  { id: 'mongo', label: 'MongoDB' },
  { id: 'supabase', label: 'Supabase' },
]

const METHOD_CLASS = {
  GET:    'bg-green-100 text-green-700',
  POST:   'bg-blue-100 text-blue-700',
  PUT:    'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
}

function LogEntry({ entry }) {
  const [open, setOpen] = useState(false)
  const time = entry.timestamp.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const path = entry.endpoint.replace('http://localhost:3002', '')

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-3 py-2.5 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
      >
        <div className="flex items-center gap-2">
          <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${METHOD_CLASS[entry.method]}`}>
            {entry.method}
          </span>
          <span className={`shrink-0 text-sm ${entry.success ? 'text-green-500' : 'text-red-400'}`}>
            {entry.success ? '✓' : '✗'}
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] text-gray-600">{path}</span>
          <span className="shrink-0 font-mono text-[10px] text-gray-400">{time}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2">
          <pre className="max-h-48 overflow-y-auto rounded border border-gray-100 bg-gray-50 p-2 font-mono text-[10px] text-gray-600 whitespace-pre-wrap break-all">
            {JSON.stringify(entry.response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function ActivityLog({ logs }) {
  return (
    <aside aria-label="Activity log" className="w-64 shrink-0">
      <div className="sticky top-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Activity Log
          </h2>
          <span className="font-mono text-[10px] text-gray-400">{logs.length} req</span>
        </div>
        {logs.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-gray-400">ยังไม่มี request</p>
        ) : (
          <div
            className="divide-y divide-gray-100 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            {[...logs].reverse().map(entry => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    return TABS.some(t => t.id === tab) ? tab : 'auth'
  })
  const [logs, setLogs] = useState([])

  function addLog(entry) {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      success: entry.response?.success !== false,
      ...entry,
    }])
  }

  function changeTab(id) {
    setActiveTab(id)
    const params = new URLSearchParams(window.location.search)
    params.set('tab', id)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  function handleKeyDown(e, index) {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    changeTab(TABS[next].id)
    document.getElementById(`tab-${TABS[next].id}`)?.focus()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-xl font-bold text-gray-800">API Tester — /api/v2</h1>

        <div className="flex items-start gap-6">
          <ActivityLog logs={logs} />

          <div className="min-w-0 flex-1">
            <div
              role="tablist"
              aria-label="API sections"
              className="mb-6 flex gap-2 border-b border-gray-200"
            >
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => changeTab(tab.id)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div id="panel-auth" role="tabpanel" aria-labelledby="tab-auth" hidden={activeTab !== 'auth'}>
              <AuthPanel onLog={addLog} />
            </div>
            <div id="panel-mongo" role="tabpanel" aria-labelledby="tab-mongo" hidden={activeTab !== 'mongo'}>
              <MongoPanel onLog={addLog} />
            </div>
            <div id="panel-supabase" role="tabpanel" aria-labelledby="tab-supabase" hidden={activeTab !== 'supabase'}>
              <SupabasePanel onLog={addLog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
