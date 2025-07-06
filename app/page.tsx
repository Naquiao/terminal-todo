"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Trash2, Terminal, Plus, Filter, CheckCircle2, Circle, Code } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  timestamp: string
}

type FilterType = "all" | "active" | "completed"

export default function LiquidTerminalTodo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const addTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      }
      setTasks([task, ...tasks])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const activeTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <div className="min-h-screen bg-black p-4 font-mono">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-t-2xl p-4 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/60"></div>
                <div className="w-3 h-3 rounded-full bg-white/40"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Terminal className="w-4 h-4" />
                <span className="text-sm">~/dev/todo-terminal</span>
              </div>
            </div>
            <div className="text-purple-400 text-sm font-mono">{currentTime}</div>
          </div>
        </div>

        {/* Main Container */}
        <div className="backdrop-blur-xl bg-white/10 border-x border-white/20 rounded-b-2xl p-6 shadow-2xl">
          {/* Terminal Prompt */}
          <div className="mb-6">
            <div className="text-purple-400 text-sm mb-2">
              <span className="text-purple-300">user@machine</span>
              <span className="text-white">:</span>
              <span className="text-purple-400">~/todo</span>
              <span className="text-white">$ </span>
              <span className="text-purple-200">./todo-manager --interactive</span>
            </div>
            <div className="text-white/60 text-xs mb-4">{">"} Liquid Glass Terminal ToDo Manager v2.1.0</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Total Tasks</div>
                  <div className="text-white text-2xl font-bold">{tasks.length}</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Completed</div>
                  <div className="text-white text-2xl font-bold">{completedTasks}</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Active</div>
                  <div className="text-white text-2xl font-bold">{activeTasks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 mb-6">
            <div className="text-purple-400 text-sm mb-2">{">"} Add new task:</div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-sm">$</span>
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="Enter task description..."
                  className="pl-8 bg-black/30 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 font-mono"
                />
              </div>
              <Button
                onClick={addTask}
                className="hover:bg-purple-700 text-white font-semibold border border-purple-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Execute
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="text-purple-400 text-sm mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Filter:
            </div>
            {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className={`font-mono text-xs ${
                  filter === filterType
                    ? "bg-purple-600 text-white border border-purple-500/50"
                    : "text-white/60 hover:text-white hover:bg-white/10 border border-white/20"
                }`}
              >
                {filterType.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/60 text-lg mb-2">{">"} No tasks found</div>
                <div className="text-white/40 text-sm">
                  {filter === "all" ? "Add your first task above" : `No ${filter} tasks`}
                </div>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] ${
                    task.completed
                      ? "bg-white/10 border-white/30"
                      : "bg-white/5 border-white/20 hover:border-purple-400/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/40 text-xs font-mono">{String(index + 1).padStart(2, "0")}</span>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-mono ${task.completed ? "text-purple-400 line-through" : "text-white"}`}>
                        {task.text}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                          {task.timestamp}
                        </Badge>
                        {task.completed && (
                          <Badge className="text-xs bg-purple-600/20 text-purple-400 border-purple-500/30">DONE</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Terminal Footer */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="text-white/40 text-xs font-mono">
              {">"} Session active • Press Ctrl+C to exit • Type 'help' for commands
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
