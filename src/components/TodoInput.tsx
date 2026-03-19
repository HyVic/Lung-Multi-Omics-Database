import { useState } from 'react'
import { useTodoStore } from '../store/todoStore'

export default function TodoInput() {
  const [value, setValue] = useState('')
  const addTodo = useTodoStore((s) => s.addTodo)

  const handleAdd = () => {
    if (value.trim()) {
      addTodo(value)
      setValue('')
    }
  }

  return (
    <div className="flex mb-4">
      <input
        className="border p-2 flex-1 rounded-l"
        type="text"
        placeholder="Enter a task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
        Add
      </button>
    </div>
  )
}