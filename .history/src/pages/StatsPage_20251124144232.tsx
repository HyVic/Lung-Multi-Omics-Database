import { useTodoStore } from '../store/todoStore'

export default function StatsPage() {
  const todos = useTodoStore((s) => s.todos)
  const done = todos.filter((t) => t.completed).length
  const total = todos.length

  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-bold">Statistics</h2>
      <p>Total Tasks: {total}</p>
      <p>Completed: {done}</p>
      <p>Incomplete: {total - done}</p>
    </div>
  )
}