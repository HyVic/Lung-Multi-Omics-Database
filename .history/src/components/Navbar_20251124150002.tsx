import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const active = (path: string) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-yellow hover:text-gray-800'

  return (
    <nav className="flex justify-between mb-6 border-b pb-2">
      <h1 className="text-lg font-bold">Todo Demo</h1>
      <div className="space-x-4">
        <Link to="/" className={active('/')}>Home</Link>
        <Link to="/stats" className={active('/stats')}>Stats</Link>
      </div>
    </nav>
  )
}