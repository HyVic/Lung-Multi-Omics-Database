import { Todo } from '../types/todo'
import { useTodoStore } from '../store/todoStore'

export default function TodoItem({ todo }: { todo: Todo }) {
  const toggle = useTodoStore((s) => s.toggleTodo)
  const remove = useTodoStore((s) => s.removeTodo)

  return (
    <li className="flex justify-between items-center p-2 border rounded mb-2 bg-white">
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={todo.completed} onChange={() => toggle(todo.id)} />
        <span className={todo.completed ? 'line-through text-gray-400' : ''}>{todo.title}</span>
      </label>
      <button onClick={() => remove(todo.id)} className="text-red-500 hover:text-red-700">
        ✕
      </button>
    </li>
  )
}