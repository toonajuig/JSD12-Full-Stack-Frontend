import UsersPanel from './UsersPanel'

function SupabasePanel({ onLog }) {
  return <UsersPanel baseUrl="http://localhost:3002/api/v2/users/pg" onLog={onLog} />
}

export default SupabasePanel
