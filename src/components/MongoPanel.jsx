import UsersPanel from './UsersPanel'

function MongoPanel({ onLog }) {
  return <UsersPanel baseUrl="http://localhost:3002/api/v2/users" onLog={onLog} />
}

export default MongoPanel
