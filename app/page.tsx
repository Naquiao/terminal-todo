"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Trash2,
  Terminal,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Code,
  Edit3,
  Save,
  X,
  FolderOpen,
  Clock,
  Star,
  Archive,
} from "lucide-react"

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

type FilterType = "all" | "active" | "completed"
type CategoryType = "personal" | "work" | "shopping" | "health" | "other"

const categories: { value: CategoryType; label: string; icon: any }[] = [
  { value: "personal", label: "Personal", icon: Star },
  { value: "work", label: "Work", icon: Code },
  { value: "shopping", label: "Shopping", icon: FolderOpen },
  { value: "health", label: "Health", icon: Clock },
  { value: "other", label: "Other", icon: Archive },
]

export default function LiquidTerminalTodo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<CategoryType>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "all">("all")
  const [currentTime, setCurrentTime] = useState("")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

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
        description: newTaskDescription.trim() || undefined,
        completed: false,
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        category: newTaskCategory,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || undefined,
      }
      setTasks([task, ...tasks])
      setNewTask("")
      setNewTaskDescription("")
      setNewTaskCategory("personal")
      setNewTaskPriority("medium")
      setNewTaskDueDate("")
      setIsAddDialogOpen(false)
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditText(task.text)
    setEditDescription(task.description || "")
  }

  const saveEdit = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editText, description: editDescription || undefined } : task,
      ),
    )
    setEditingTask(null)
    setEditText("")
    setEditDescription("")
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditText("")
    setEditDescription("")
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
    return matchesStatus && matchesCategory
  })

  const activeTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-purple-300"
      case "medium":
        return "text-purple-400"
      case "low":
        return "text-purple-500"
      default:
        return "text-purple-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.icon : Archive
  }

  return (
    <div className="min-h-screen bg-black p-4 font-mono">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
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
                <span className="text-sm">~/dev/advanced-todo-manager</span>
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
              <span className="text-purple-200">./advanced-todo-manager --interactive --features=all</span>
            </div>
            <div className="text-white/60 text-xs mb-4">{">"} Advanced Liquid Glass Terminal ToDo Manager v3.0.0</div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Total Tasks</div>
                  <div className="text-white text-2xl font-bold">{tasks.length}</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Completed</div>
                  <div className="text-white text-2xl font-bold">{completedTasks}</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Active</div>
                  <div className="text-white text-2xl font-bold">{activeTasks}</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-purple-400 text-sm">Categories</div>
                  <div className="text-white text-2xl font-bold">{new Set(tasks.map((t) => t.category)).size}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add Task */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 mb-6">
            <div className="text-purple-400 text-sm mb-2">{">"} Quick add task:</div>
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border border-purple-500/50">
                    <Plus className="w-4 h-4 mr-1" />
                    Advanced
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-purple-400">Create Advanced Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-purple-400 text-sm mb-2 block">Task Title</label>
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter task title..."
                        className="bg-black/30 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-purple-400 text-sm mb-2 block">Description</label>
                      <Textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Enter task description..."
                        className="bg-black/30 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-purple-400 text-sm mb-2 block">Category</label>
                        <Select
                          value={newTaskCategory}
                          onValueChange={(value: CategoryType) => setNewTaskCategory(value)}
                        >
                          <SelectTrigger className="bg-black/30 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-purple-400 text-sm mb-2 block">Priority</label>
                        <Select
                          value={newTaskPriority}
                          onValueChange={(value: "low" | "medium" | "high") => setNewTaskPriority(value)}
                        >
                          <SelectTrigger className="bg-black/30 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                            <SelectItem value="low" className="text-white hover:bg-white/10">
                              Low
                            </SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-white/10">
                              Medium
                            </SelectItem>
                            <SelectItem value="high" className="text-white hover:bg-white/10">
                              High
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-purple-400 text-sm mb-2 block">Due Date</label>
                      <Input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="bg-black/30 border-white/20 text-white focus:border-purple-400"
                      />
                    </div>
                    <Button onClick={addTask} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={addTask}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border border-purple-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="text-purple-400 text-sm flex items-center">
                <Filter className="w-4 h-4 mr-1" />
                Status:
              </div>
              <div className="flex gap-2">
                {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className={`font-mono text-xs transition-all duration-200 ${
                      filter === filterType
                        ? "bg-purple-600 text-white border border-purple-500/50"
                        : "text-white/60 hover:text-white hover:bg-white/10 border border-white/20"
                    }`}
                  >
                    {filterType.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-purple-400 text-sm flex items-center">
                <FolderOpen className="w-4 h-4 mr-1" />
                Category:
              </div>
              <Select value={categoryFilter} onValueChange={(value: CategoryType | "all") => setCategoryFilter(value)}>
                <SelectTrigger className="w-32 bg-black/30 border-white/20 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    All
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/60 text-lg mb-2">{">"} No tasks found</div>
                <div className="text-white/40 text-sm">
                  {filter === "all" && categoryFilter === "all"
                    ? "Add your first task above"
                    : `No ${filter !== "all" ? filter : ""} ${categoryFilter !== "all" ? categoryFilter : ""} tasks`}
                </div>
              </div>
            ) : (
              filteredTasks.map((task, index) => {
                const CategoryIcon = getCategoryIcon(task.category)
                return (
                  <div
                    key={task.id}
                    className={`backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] transform ${
                      task.completed
                        ? "bg-white/10 border-white/30"
                        : "bg-white/5 border-white/20 hover:border-purple-400/50 hover:bg-white/10"
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
                        {editingTask === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-black/30 border-white/20 text-white focus:border-purple-400"
                            />
                            <Textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Description..."
                              className="bg-black/30 border-white/20 text-white focus:border-purple-400"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(task.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="text-white/60 hover:text-white"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`font-mono ${task.completed ? "text-purple-400 line-through" : "text-white"}`}
                            >
                              {task.text}
                            </div>
                            {task.description && <div className="text-white/70 text-sm mt-1">{task.description}</div>}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                {task.timestamp}
                              </Badge>
                              <Badge
                                className={`text-xs bg-purple-600/20 border-purple-500/30 ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority.toUpperCase()}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs border-white/20 text-purple-400 flex items-center gap-1"
                              >
                                <CategoryIcon className="w-3 h-3" />
                                {categories.find((c) => c.value === task.category)?.label}
                              </Badge>
                              {task.dueDate && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-white/20 text-white/60 flex items-center gap-1"
                                >
                                  <Clock className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Badge>
                              )}
                              {task.completed && (
                                <Badge className="text-xs bg-purple-600/20 text-purple-400 border-purple-500/30">
                                  DONE
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex gap-1">
                        {editingTask !== task.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(task)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}
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
                  </div>
                )
              })
            )}
          </div>

          {/* Terminal Footer */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="text-white/40 text-xs font-mono">
              {">"} Session active • Advanced features enabled • Type 'help' for commands
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
