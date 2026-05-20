import { useState } from 'react'
import ResponseBox from './ResponseBox'

const BASE = 'http://localhost:3002/api/v2/users'

function AuthPanel() {
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerRes, setRegisterRes] = useState(null)
  const [loginRes, setLoginRes] = useState(null)
  const [loading, setLoading] = useState({ register: false, login: false })

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(prev => ({ ...prev, register: true }))
    try {
      const res = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })
      setRegisterRes(await res.json())
    } catch (err) {
      setRegisterRes({ success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, register: false }))
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(prev => ({ ...prev, login: true }))
    try {
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      setLoginRes(await res.json())
    } catch (err) {
      setLoginRes({ success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, login: false }))
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Register */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-semibold text-gray-700">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="username"
            value={registerForm.username}
            onChange={e => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
          />
          <input
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="email"
            type="email"
            value={registerForm.email}
            onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="password"
            type="password"
            value={registerForm.password}
            onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
          />
          <select
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={registerForm.role}
            onChange={e => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="submit"
            disabled={loading.register}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading.register ? 'Sending...' : 'POST /register'}
          </button>
        </form>
        <ResponseBox response={registerRes} />
      </div>

      {/* Login */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-semibold text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="email"
            type="email"
            value={loginForm.email}
            onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <input
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="password"
            type="password"
            value={loginForm.password}
            onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
          />
          <button
            type="submit"
            disabled={loading.login}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading.login ? 'Sending...' : 'POST /login'}
          </button>
        </form>
        <ResponseBox response={loginRes} />
      </div>
    </div>
  )
}

export default AuthPanel
