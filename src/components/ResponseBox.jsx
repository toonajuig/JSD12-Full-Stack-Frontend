function formatDate(value) {
  if (!value) return '-'
  const d = new Date(value)
  return isNaN(d) ? value : d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
}

function RoleBadge({ role }) {
  const styles = role === 'admin'
    ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-300'
    : 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${styles}`}>
      {role}
    </span>
  )
}

function UserTable({ users }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, i) => (
            <tr key={user._id ?? user.id ?? i} className="hover:bg-gray-50">
              <td className="px-4 py-2.5 font-medium text-gray-800">{user.username}</td>
              <td className="px-4 py-2.5 text-gray-600">{user.email}</td>
              <td className="px-4 py-2.5">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-2.5 text-gray-500">{formatDate(user.createdAt ?? user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-1.5 text-xs text-gray-400">
        {users.length} records
      </div>
    </div>
  )
}

function ResponseBox({ response }) {
  if (!response) return null

  const isError = response?.success === false
  const isUserList = response?.success === true && Array.isArray(response.data)

  if (isUserList) {
    return (
      <div role="status" aria-live="polite">
        <UserTable users={response.data} />
      </div>
    )
  }

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`mt-3 rounded-md border p-3 text-sm font-mono ${isError ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'}`}
    >
      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}

export default ResponseBox
