function ResponseBox({ response }) {
  if (!response) return null

  const isError = response?.success === false

  return (
    <div className={`mt-3 rounded-md border p-3 text-sm font-mono ${isError ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'}`}>
      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}

export default ResponseBox
