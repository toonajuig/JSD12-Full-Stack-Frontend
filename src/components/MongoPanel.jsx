import { useState } from 'react'
import ResponseBox from './ResponseBox'

const BASE = 'http://localhost:3002/api/v2/users'

function MongoPanel() {
  const [postForm, setPostForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [putForm, setPutForm] = useState({ id: '', username: '', email: '', password: '' })
  const [deleteId, setDeleteId] = useState('')
  const [responses, setResponses] = useState({ get: null, post: null, put: null, delete: null })
  const [loading, setLoading] = useState({ get: false, post: false, put: false, delete: false })

  function setRes(action, data) {
    setResponses(prev => ({ ...prev, [action]: data }))
  }

  async function handleGet() {
    setLoading(prev => ({ ...prev, get: true }))
    try {
      const res = await fetch(BASE)
      setRes('get', await res.json())
    } catch (err) {
      setRes('get', { success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, get: false }))
    }
  }

  async function handlePost(e) {
    e.preventDefault()
    setLoading(prev => ({ ...prev, post: true }))
    try {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      })
      setRes('post', await res.json())
    } catch (err) {
      setRes('post', { success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, post: false }))
    }
  }

  async function handlePut(e) {
    e.preventDefault()
    setLoading(prev => ({ ...prev, put: true }))
    try {
      const { id, ...body } = putForm
      const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setRes('put', await res.json())
    } catch (err) {
      setRes('put', { success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, put: false }))
    }
  }

  async function handleDelete(e) {
    e.preventDefault()
    setLoading(prev => ({ ...prev, delete: true }))
    try {
      const res = await fetch(`${BASE}/${deleteId}`, { method: 'DELETE' })
      setRes('delete', await res.json())
    } catch (err) {
      setRes('delete', { success: false, error: err.message })
    } finally {
      setLoading(prev => ({ ...prev, delete: false }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* GET */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-3 font-semibold text-gray-700">GET /users</h2>
        <button
          onClick={handleGet}
          disabled={loading.get}
          className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
        >
          {loading.get ? 'Loading...' : 'GET all users'}
        </button>
        <ResponseBox response={responses.get} />
      </div>

      {/* POST */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-semibold text-gray-700">POST /users</h2>
        <form onSubmit={handlePost} className="flex flex-col gap-3">
          <input className="input" placeholder="username" value={postForm.username} onChange={e => setPostForm(p => ({ ...p, username: e.target.value }))} />
          <input className="input" placeholder="email" type="email" value={postForm.email} onChange={e => setPostForm(p => ({ ...p, email: e.target.value }))} />
          <input className="input" placeholder="password" type="password" value={postForm.password} onChange={e => setPostForm(p => ({ ...p, password: e.target.value }))} />
          <select className="input" value={postForm.role} onChange={e => setPostForm(p => ({ ...p, role: e.target.value }))}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit" disabled={loading.post} className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50">
            {loading.post ? 'Sending...' : 'POST /users'}
          </button>
        </form>
        <ResponseBox response={responses.post} />
      </div>

      {/* PUT */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-semibold text-gray-700">PUT /users/:id</h2>
        <form onSubmit={handlePut} className="flex flex-col gap-3">
          <input className="input" placeholder="MongoDB ObjectId" value={putForm.id} onChange={e => setPutForm(p => ({ ...p, id: e.target.value }))} />
          <input className="input" placeholder="username" value={putForm.username} onChange={e => setPutForm(p => ({ ...p, username: e.target.value }))} />
          <input className="input" placeholder="email" type="email" value={putForm.email} onChange={e => setPutForm(p => ({ ...p, email: e.target.value }))} />
          <input className="input" placeholder="password" type="password" value={putForm.password} onChange={e => setPutForm(p => ({ ...p, password: e.target.value }))} />
          <button type="submit" disabled={loading.put} className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50">
            {loading.put ? 'Sending...' : 'PUT /users/:id'}
          </button>
        </form>
        <ResponseBox response={responses.put} />
      </div>

      {/* DELETE */}
      <div className="rounded-lg border border-gray-200 p-5">
        <h2 className="mb-4 font-semibold text-gray-700">DELETE /users/:id</h2>
        <form onSubmit={handleDelete} className="flex flex-col gap-3">
          <input className="input" placeholder="MongoDB ObjectId" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
          <button type="submit" disabled={loading.delete} className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
            {loading.delete ? 'Sending...' : 'DELETE /users/:id'}
          </button>
        </form>
        <ResponseBox response={responses.delete} />
      </div>
    </div>
  )
}

export default MongoPanel
