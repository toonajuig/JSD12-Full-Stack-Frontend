import { useState } from 'react'
import AuthPanel from './components/AuthPanel'
import MongoPanel from './components/MongoPanel'
import SupabasePanel from './components/SupabasePanel'

const TABS = [
  { id: 'auth', label: 'Auth' },
  { id: 'mongo', label: 'MongoDB' },
  { id: 'supabase', label: 'Supabase' },
]

function App() {
  const [activeTab, setActiveTab] = useState('auth')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-xl font-bold text-gray-800">API Tester — /api/v2</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        {activeTab === 'auth' && <AuthPanel />}
        {activeTab === 'mongo' && <MongoPanel />}
        {activeTab === 'supabase' && <SupabasePanel />}
      </div>
    </div>
  )
}

export default App
