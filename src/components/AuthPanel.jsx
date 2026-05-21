import { useState } from 'react'
import ResponseBox from './ResponseBox'

const BASE = 'http://localhost:3002/api/v2/users'

function AuthPanel({ onLog }) {
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
      const data = await res.json()
      setRegisterRes(data)
      onLog({ method: 'POST', endpoint: `${BASE}/register`, response: data })
    } catch (err) {
      const errData = { success: false, error: err.message }
      setRegisterRes(errData)
      onLog({ method: 'POST', endpoint: `${BASE}/register`, response: errData })
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
      const data = await res.json()
      setLoginRes(data)
      onLog({ method: 'POST', endpoint: `${BASE}/login`, response: data })
    } catch (err) {
      const errData = { success: false, error: err.message }
      setLoginRes(errData)
      onLog({ method: 'POST', endpoint: `${BASE}/login`, response: errData })
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
          <div>
            <label htmlFor="reg-username" className="mb-1 block text-xs font-medium text-gray-600">Username</label>
            <input
              id="reg-username"
              className="input"
              placeholder="johndoe"
              autoComplete="username"
              value={registerForm.username}
              onChange={e => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              id="reg-email"
              className="input"
              placeholder="john@example.com"
              type="email"
              autoComplete="email"
              value={registerForm.email}
              onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1 block text-xs font-medium text-gray-600">Password</label>
            <input
              id="reg-password"
              className="input"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              value={registerForm.password}
              onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="reg-role" className="mb-1 block text-xs font-medium text-gray-600">Role</label>
            <select
              id="reg-role"
              className="input"
              value={registerForm.role}
              onChange={e => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading.register}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
          <div>
            <label htmlFor="login-email" className="mb-1 block text-xs font-medium text-gray-600">Email</label>
            <input
              id="login-email"
              className="input"
              placeholder="john@example.com"
              type="email"
              autoComplete="email"
              value={loginForm.email}
              onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-xs font-medium text-gray-600">Password</label>
            <input
              id="login-password"
              className="input"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              value={loginForm.password}
              onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading.login}
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
