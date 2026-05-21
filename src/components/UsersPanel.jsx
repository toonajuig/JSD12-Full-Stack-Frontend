import { useState, useEffect, useRef, useCallback } from 'react'

const EMPTY_ADD = { username: '', email: '', password: '', role: 'user' }

function Avatar({ name }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function RoleBadge({ role }) {
  const cls = role === 'admin'
    ? 'bg-orange-100 text-orange-700'
    : 'bg-blue-100 text-blue-700'
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {role}
    </span>
  )
}

function formatDate(value) {
  if (!value) return '-'
  const d = new Date(value)
  return isNaN(d) ? '-' : d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

function Modal({ title, onClose, children }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function UsersPanel({ baseUrl, onLog }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null) // null | { mode: 'add' | 'edit', user?: {} }
  const [form, setForm] = useState(EMPTY_ADD)
  const [submitting, setSubmitting] = useState(false)

  // ref เพื่อกัน infinite loop — onLog สร้าง reference ใหม่ทุก render
  const onLogRef = useRef(onLog)
  useEffect(() => { onLogRef.current = onLog })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(baseUrl)
      const data = await res.json()
      onLogRef.current?.({ method: 'GET', endpoint: baseUrl, response: data })
      if (!data.success) throw new Error(data.error ?? 'Fetch failed')
      setUsers(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  function openAdd() {
    setForm(EMPTY_ADD)
    setError(null)
    setModal({ mode: 'add' })
  }

  function openEdit(user) {
    setForm({ username: user.username, role: user.role })
    setError(null)
    setModal({ mode: 'edit', user })
  }

  function closeModal() {
    setModal(null)
    setError(null)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const isEdit = modal.mode === 'edit'
    const id = isEdit ? (modal.user.id ?? modal.user._id) : null
    const endpoint = isEdit ? `${baseUrl}/${id}` : baseUrl
    const method = isEdit ? 'PUT' : 'POST'
    const body = isEdit ? { username: form.username, role: form.role } : form

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      onLogRef.current?.({ method, endpoint, response: data })
      if (!data.success) throw new Error(data.error ?? 'Operation failed')
      closeModal()
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`ลบ "${user.username}" จริงไหม?`)) return
    const id = user.id ?? user._id
    const endpoint = `${baseUrl}/${id}`
    try {
      const res = await fetch(endpoint, { method: 'DELETE' })
      const data = await res.json()
      onLogRef.current?.({ method: 'DELETE', endpoint, response: data })
      if (!data.success) throw new Error(data.error ?? 'Delete failed')
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Users</span>
          {!loading && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {users.length}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && !modal && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-sm text-gray-400">ยังไม่มี user</p>
            <button type="button" onClick={openAdd} className="text-xs text-blue-500 hover:underline">
              + Add User
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2.5 text-left">User</th>
                <th className="px-4 py-2.5 text-left">Email</th>
                <th className="px-4 py-2.5 text-left">Role</th>
                <th className="px-4 py-2.5 text-left">Created</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, i) => (
                <tr key={user._id ?? user.id ?? i} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.username} />
                      <span className="font-medium text-gray-800">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatDate(user.createdAt ?? user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add User' : 'Edit User'}
          onClose={closeModal}
        >
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Username</label>
              <input
                className="input"
                required
                autoFocus
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              />
            </div>

            {modal.mode === 'add' && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
                  <input
                    className="input"
                    type="email"
                    required
                    value={form.email ?? ''}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
                  <input
                    className="input"
                    type="password"
                    required
                    minLength={8}
                    value={form.password ?? ''}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default UsersPanel
