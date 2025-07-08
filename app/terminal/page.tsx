"use client"

import { useState, useEffect } from "react"
import TerminalMode from "@/components/terminal-mode"

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  timestamp: string
  category: string
  priority: "low" | "medium" | "high"
  dueDate?: string
}

export default function TerminalPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("todo-tasks")
      if (stored) {
        setTasks(JSON.parse(stored))
      }
    } catch (error) {
      console.warn("Failed to load tasks from localStorage:", error)
    }
  }, [])

  // Save tasks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("todo-tasks", JSON.stringify(tasks))
    } catch (error) {
      console.warn("Failed to save tasks to localStorage:", error)
    }
  }, [tasks])

  const handleGoToGui = () => {
    window.location.href = "/"
  }

  return (
    <TerminalMode 
      tasks={tasks} 
      onTasksChange={setTasks} 
      onModeSwitch={handleGoToGui} 
    />
  )
} 