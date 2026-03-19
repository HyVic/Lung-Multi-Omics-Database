import { create } from 'zustand'
import { Todo } from '../types/todo'

interface TodoState {
  todos: Todo[]
  addTodo: (title: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: JSON.parse(localStorage.getItem('todos') || '[]'),
  addTodo: (title) =>
    set((state) => {
      const updated = [...state.todos, { id: Date.now(), title, completed: false }]
      localStorage.setItem('todos', JSON.stringify(updated))
      return { todos: updated }
    }),
  toggleTodo: (id) =>
    set((state) => {
      const updated = state.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
      localStorage.setItem('todos', JSON.stringify(updated))
      return { todos: updated }
    }),
  removeTodo: (id) =>
    set((state) => {
      const updated = state.todos.filter((t) => t.id !== id)
      localStorage.setItem('todos', JSON.stringify(updated))
      return { todos: updated }
    }),
}))