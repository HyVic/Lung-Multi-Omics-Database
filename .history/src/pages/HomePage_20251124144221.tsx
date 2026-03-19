import { useTodoStore } from '../store/todoStore'
import TodoInput from '../components/TodoInput'
import TodoItem from '../components/TodoItem'

export default function HomePage() {
  const todos = useTodoStore((s) => s.todos)

  return (
    <div>
      <TodoInput />
      <ul>
        {todos.length ? (
          todos.map((t) => <TodoItem key={t.id} todo={t} />)
        ) : (
          <p className="text-gray-500 text-center">No todos yet.</p>
        )}
      </ul>
    </div>
  )
}