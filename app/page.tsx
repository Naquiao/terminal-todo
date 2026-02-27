"use client"
 
import React, { useState, useEffect, useMemo, useCallback, memo } from "react"
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
  Copy,
  Zap,
  Heart,
  BookOpen,
  Coffee,
  Dumbbell,
  Car,
  Home,
  ShoppingCart,
  Command,
  Layers,
  ListTodo,
  MoreHorizontal,
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

interface TaskTemplate {
  id: string
  name: string
  text: string
  description?: string
  category: CategoryType
  priority: "low" | "medium" | "high"
  icon: any
  tags?: string[]
}

const categories: { value: CategoryType; label: string; icon: any }[] = [
  { value: "personal", label: "Personal", icon: Star },
  { value: "work", label: "Work", icon: Code },
  { value: "shopping", label: "Shopping", icon: FolderOpen },
  { value: "health", label: "Health", icon: Clock },
  { value: "other", label: "Other", icon: Archive },
]

const taskTemplates: TaskTemplate[] = [
  {
    id: "weekly-review",
    name: "Weekly Review",
    text: "Conduct weekly review and planning",
    description: "Review completed tasks, plan upcoming week, and set priorities",
    category: "work",
    priority: "medium",
    icon: BookOpen,
  },
  {
    id: "standup-prep",
    name: "Daily Standup Prep",
    text: "Prepare for daily standup meeting",
    description: "Review yesterday's work, plan today's tasks, note any blockers",
    category: "work",
    priority: "low",
    icon: Coffee,
  },
  {
    id: "code-review",
    name: "Code Review",
    text: "Review team code submissions",
    description: "Review pending pull requests and provide feedback",
    category: "work",
    priority: "medium",
    icon: Code,
  },

  // Personal templates
  {
    id: "morning-routine",
    name: "Morning Routine",
    text: "Complete morning routine",
    description: "Exercise, meditation, healthy breakfast, and daily planning",
    category: "personal",
    priority: "high",
    icon: Star,
  },
  {
    id: "family-time",
    name: "Quality Family Time",
    text: "Spend quality time with family",
    description: "Disconnect from work and focus on family activities",
    category: "personal",
    priority: "high",
    icon: Heart,
  },
  {
    id: "learning-session",
    name: "Learning Session",
    text: "Dedicated learning/skill development",
    description: "Read, take a course, or practice a new skill for 1 hour",
    category: "personal",
    priority: "medium",
    icon: BookOpen,
  },

  // Health templates
  {
    id: "workout",
    name: "Workout Session",
    text: "Complete workout routine",
    description: "30-60 minutes of physical exercise",
    category: "health",
    priority: "high",
    icon: Dumbbell,
  },
  {
    id: "meal-prep",
    name: "Meal Prep",
    text: "Prepare healthy meals for the week",
    description: "Plan, shop for, and prepare nutritious meals",
    category: "health",
    priority: "medium",
    icon: Coffee,
  },
  {
    id: "meditation",
    name: "Meditation",
    text: "Daily meditation practice",
    description: "10-20 minutes of mindfulness or meditation",
    category: "health",
    priority: "medium",
    icon: Heart,
  },

  // Shopping templates
  {
    id: "grocery-run",
    name: "Grocery Shopping",
    text: "Buy groceries for the week",
    description: "Shop for fresh produce, essentials, and planned meals",
    category: "shopping",
    priority: "medium",
    icon: ShoppingCart,
  },
  {
    id: "household-supplies",
    name: "Household Supplies",
    text: "Restock household essentials",
    description: "Cleaning supplies, toiletries, and other household items",
    category: "shopping",
    priority: "low",
    icon: Home,
  },

  // Other templates
  {
    id: "car-maintenance",
    name: "Car Maintenance",
    text: "Vehicle maintenance check",
    description: "Oil change, tire pressure, and general vehicle inspection",
    category: "other",
    priority: "medium",
    icon: Car,
  },
  {
    id: "monthly-budget",
    name: "Monthly Budget Review",
    text: "Review and update monthly budget",
    description: "Analyze expenses, update budget categories, plan for next month",
    category: "other",
    priority: "medium",
    icon: Archive,
  },
]

// Custom hook for time management
const useCurrentTime = () => {
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

  return currentTime
}

// Custom hook for task management
const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'timestamp'>) => {
    const task: Task = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      ...taskData,
    }
    setTasks(prev => [task, ...prev])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }, [])

  const duplicateTask = useCallback((id: string) => {
    setTasks(prev => {
      const taskToDuplicate = prev.find(task => task.id === id)
      if (!taskToDuplicate) return prev
      
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        completed: false,
        text: `${taskToDuplicate.text} (Copy)`,
      }
      return [duplicatedTask, ...prev]
    })
  }, [])

  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length,
    categories: new Set(tasks.map(task => task.category)).size,
  }), [tasks])

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    duplicateTask,
    taskStats,
  }
}

// Memoized components
const AppHeader = memo(({ currentTime }: { currentTime: string }) => (
  <div className="glass-card border-b border-white/10 rounded-t-2xl rounded-b-none p-6 mb-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Tasks</h1>
            <p className="text-xs text-gray-400">Organize your work efficiently</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{currentTime}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Command className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Press <kbd className="kbd">K</kbd> for shortcuts</span>
        </div>
      </div>
    </div>
  </div>
))

const StatsCard = memo(({ icon: Icon, title, value, color = "blue" }: { 
  icon: any
  title: string
  value: number
  color?: string
}) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/10 to-green-500/5 border-green-500/20 text-green-400",
    gray: "from-gray-500/10 to-gray-500/5 border-gray-500/20 text-gray-400",
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400"
  }[color]

  return (
    <div className={`backdrop-blur-sm bg-gradient-to-br ${colorClasses} border rounded-lg p-4 transition-all duration-200 hover:scale-[1.02] group cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</div>
          <div className="text-white text-3xl font-semibold tracking-tight">{value}</div>
        </div>
        <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
})

const StatsDashboard = memo(({ stats }: { stats: ReturnType<typeof useTasks>['taskStats'] }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
    <StatsCard icon={Layers} title="Total" value={stats.total} color="blue" />
    <StatsCard icon={CheckCircle2} title="Completed" value={stats.completed} color="green" />
    <StatsCard icon={Circle} title="Active" value={stats.active} color="gray" />
    <StatsCard icon={FolderOpen} title="Categories" value={stats.categories} color="indigo" />
  </div>
))

const TaskTemplateSelector = memo(({ 
  onSelectTemplate, 
  selectedCategory 
}: {
  onSelectTemplate: (template: TaskTemplate) => void
  selectedCategory?: CategoryType | "all"
}) => {
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all" || !selectedCategory) {
      return taskTemplates
    }
    return taskTemplates.filter(template => template.category === selectedCategory)
  }, [selectedCategory])

  const templatesByCategory = useMemo(() => {
    const grouped = filteredTemplates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    }, {} as Record<CategoryType, TaskTemplate[]>)
    return grouped
  }, [filteredTemplates])

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 mb-6">
      <div className="text-purple-400 text-sm mb-3 flex items-center">
        <Zap className="w-4 h-4 mr-1" />
        Quick Templates:
      </div>
      <div className="space-y-3">
        {Object.entries(templatesByCategory).map(([category, templates]) => (
          <div key={category}>
            <div className="text-purple-300 text-xs uppercase tracking-wide mb-2 flex items-center">
              {categories.find(cat => cat.value === category)?.icon && 
                <span className="mr-1">{React.createElement(categories.find(cat => cat.value === category)!.icon, { className: "w-3 h-3" })}</span>
              }
              {category}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {templates.map((template) => {
                const IconComponent = template.icon
                return (
                  <Button
                    key={template.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectTemplate(template)}
                    className="text-left justify-start h-auto p-3 bg-black/20 hover:bg-purple-600/20 border border-white/10 hover:border-purple-400/30 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2 w-full">
                      <IconComponent className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{template.name}</div>
                        <div className="text-white/60 text-xs mt-1 line-clamp-2">{template.text}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`text-xs px-1.5 py-0.5 rounded text-purple-300 bg-purple-600/20 border border-purple-500/30`}>
                            {template.priority.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

const AdvancedTaskDialog = memo(({ 
  isOpen, 
  onOpenChange, 
  onAddTask 
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: Omit<Task, 'id' | 'timestamp'>) => void
}) => {
  const [formData, setFormData] = useState({
    text: "",
    description: "",
    category: "personal" as CategoryType,
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  })

  const handleTemplateSelect = useCallback((template: TaskTemplate) => {
    setFormData({
      text: template.text,
      description: template.description || "",
      category: template.category,
      priority: template.priority,
      dueDate: "",
    })
  }, [])

  const handleSubmit = useCallback(() => {
    if (formData.text.trim()) {
      onAddTask({
        text: formData.text.trim(),
        description: formData.description.trim() || undefined,
        completed: false,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      })
      setFormData({
        text: "",
        description: "",
        category: "personal",
        priority: "medium",
        dueDate: "",
      })
      onOpenChange(false)
    }
  }, [formData, onAddTask, onOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium border border-white/10 h-11 px-5 rounded-lg">
          <MoreHorizontal className="w-4 h-4 mr-2" />
          More Options
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950/95 backdrop-blur-xl border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <label className="text-blue-400 text-sm font-medium mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Quick Templates
            </label>
            <div className="grid grid-cols-3 gap-2">
              {taskTemplates.slice(0, 6).map((template) => {
                const IconComponent = template.icon
                return (
                  <Button
                    key={template.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                    className="text-left justify-start h-auto p-3 bg-white/[0.03] hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/30 transition-all"
                  >
                    <IconComponent className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-white text-xs truncate">{template.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          <div>  
            <label className="text-gray-300 text-sm font-medium mb-2 block">Task Title</label>
            <Input
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="What needs to be done?"
              className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 h-11"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details..."
              className="bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 min-h-[100px] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value: CategoryType) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-white/[0.03] border-white/10 text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-950/95 backdrop-blur-xl border-white/10">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-white/[0.03] border-white/10 text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-950/95 backdrop-blur-xl border-white/10">
                  <SelectItem value="low" className="text-white hover:bg-white/10">Low Priority</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-white/10">Medium Priority</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-white/10">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Due Date</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="bg-white/[0.03] border-white/10 text-white focus:border-blue-500/50 h-11"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium"
            disabled={!formData.text.trim()}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})

const QuickAddTask = memo(({ onAddTask }: { onAddTask: (task: Omit<Task, 'id' | 'timestamp'>) => void }) => {
  const [newTask, setNewTask] = useState("")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const handleQuickAdd = useCallback(() => {
    if (newTask.trim()) {
      onAddTask({
        text: newTask.trim(),
        completed: false,
        category: "personal",
        priority: "medium",
      })
      setNewTask("")
    }
  }, [newTask, onAddTask])

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex gap-3">
        <div className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
            placeholder="Add a new task... (Press Enter)"
            className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white/[0.05] h-11 rounded-lg transition-all"
          />
        </div>
        <AdvancedTaskDialog 
          isOpen={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          onAddTask={onAddTask}
        />
        <Button
          onClick={handleQuickAdd}
          disabled={!newTask.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium border-0 h-11 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  )
})

const TaskFilters = memo(({ 
  filter, 
  categoryFilter, 
  onFilterChange, 
  onCategoryFilterChange 
}: {
  filter: FilterType
  categoryFilter: CategoryType | "all"
  onFilterChange: (filter: FilterType) => void
  onCategoryFilterChange: (category: CategoryType | "all") => void
}) => (
  <div className="flex flex-wrap items-center gap-3 mb-6">
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm font-medium">View:</span>
      <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-lg">
        {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
          <Button
            key={filterType}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filterType)}
            className={`text-xs font-medium transition-all duration-200 px-3 h-8 rounded-md ${
              filter === filterType
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5 border-0"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Button>
        ))}
      </div>
    </div>

    <div className="h-5 w-px bg-white/10" />

    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm font-medium">Category:</span>
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-36 bg-white/[0.03] border-white/10 text-white text-sm h-9 rounded-lg hover:bg-white/[0.05] transition-all">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-950/95 backdrop-blur-xl border-white/10">
          <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Categories</SelectItem>
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10 focus:bg-white/10">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  </div>
))

const TaskItem = memo(({ 
  task, 
  index, 
  onToggle, 
  onDelete, 
  onUpdate,
  onDuplicate 
}: {
  task: Task
  index: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDuplicate: (id: string) => void
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const startEditing = useCallback(() => {
    setEditingTask(task.id)
    setEditText(task.text)
    setEditDescription(task.description || "")
  }, [task.id, task.text, task.description])

  const saveEdit = useCallback(() => {
    onUpdate(task.id, { 
      text: editText, 
      description: editDescription || undefined 
    })
    setEditingTask(null)
    setEditText("")
    setEditDescription("")
  }, [task.id, editText, editDescription, onUpdate])

  const cancelEdit = useCallback(() => {
    setEditingTask(null)
    setEditText("")
    setEditDescription("")
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "high": return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" }
      case "medium": return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" }
      case "low": return { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" }
      default: return { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400" }
    }
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.icon : Archive
  }, [])

  const CategoryIcon = getCategoryIcon(task.category)
  const priorityColors = getPriorityColor(task.priority)

  return (
    <div
      className={`task-card p-4 group ${task.completed ? "opacity-60" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3 pt-0.5">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md w-5 h-5"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {editingTask === task.id ? (
            <div className="space-y-3">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-white/[0.03] border-white/10 text-white focus:border-blue-500/50 h-10"
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add description..."
                className="bg-white/[0.03] border-white/10 text-white focus:border-blue-500/50 min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={saveEdit} 
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 h-8"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-white hover:bg-white/5 h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={`text-[15px] leading-relaxed ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                {task.text}
              </div>
              {task.description && (
                <div className="text-gray-400 text-sm leading-relaxed">
                  {task.description}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${priorityColors.bg} ${priorityColors.border} ${priorityColors.text} border`}
                >
                  {task.priority}
                </Badge>
                <Badge variant="outline" className="text-xs border-white/10 text-gray-400 flex items-center gap-1.5 font-normal">
                  <CategoryIcon className="w-3 h-3" />
                  {categories.find((c) => c.value === task.category)?.label}
                </Badge>
                {task.dueDate && (
                  <Badge variant="outline" className="text-xs border-white/10 text-gray-400 flex items-center gap-1.5 font-normal">
                    <Clock className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-white/10 text-gray-500 font-normal">
                  {task.timestamp}
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className={`flex items-center gap-1 transition-opacity ${isHovered || editingTask === task.id ? "opacity-100" : "opacity-0"}`}>
          {editingTask !== task.id && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={startEditing}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(task.id)}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost"
                size="sm" 
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

const TasksList = memo(({ 
  tasks, 
  filter, 
  categoryFilter, 
  onToggle, 
  onDelete, 
  onUpdate,
  onDuplicate 
}: {
  tasks: Task[]
  filter: FilterType
  categoryFilter: CategoryType | "all"
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDuplicate: (id: string) => void
}) => {
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)
      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter
      return matchesStatus && matchesCategory
    })
  }, [tasks, filter, categoryFilter])

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
        </div>
        <div className="text-white text-lg font-medium mb-2">No tasks found</div>
        <div className="text-gray-400 text-sm">
          {filter === "all" && categoryFilter === "all"
            ? "Create your first task to get started"
            : `No ${filter !== "all" ? filter : ""} ${categoryFilter !== "all" ? categoryFilter : ""} tasks`}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  )
})

export default function LiquidTerminalTodo() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "all">("all")
  
  const currentTime = useCurrentTime()
  const { tasks, addTask, toggleTask, deleteTask, updateTask, duplicateTask, taskStats } = useTasks()

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter)
  }, [])

  const handleCategoryFilterChange = useCallback((newCategory: CategoryType | "all") => {
    setCategoryFilter(newCategory)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <AppHeader currentTime={currentTime} />

        {/* Main Container */}
        <div className="glass-card border-t-0 rounded-t-none rounded-b-2xl p-8 shadow-2xl">
          <StatsDashboard stats={taskStats} />
          <QuickAddTask onAddTask={addTask} />
          
          <TaskFilters
            filter={filter}
            categoryFilter={categoryFilter}
            onFilterChange={handleFilterChange}
            onCategoryFilterChange={handleCategoryFilterChange}
          />
          
          {/* Category-specific quick actions */}
          {categoryFilter !== "all" && (
            <div className="glass-card p-4 mb-6">
              <div className="text-blue-400 text-sm font-medium mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions for {categories.find(cat => cat.value === categoryFilter)?.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {taskTemplates
                  .filter(template => template.category === categoryFilter)
                  .slice(0, 4)
                  .map((template) => {
                    const IconComponent = template.icon
                    return (
                      <Button
                        key={template.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => addTask({
                          text: template.text,
                          description: template.description,
                          completed: false,
                          category: template.category,
                          priority: template.priority,
                        })}
                        className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:text-blue-200 transition-all duration-200 h-9"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {template.name}
                      </Button>
                    )
                  })}
              </div>
            </div>
          )}
          
          <TasksList
            tasks={tasks}
            filter={filter}
            categoryFilter={categoryFilter}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onDuplicate={duplicateTask}
          />

          {/* Footer */}
          {tasks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{tasks.length} total task{tasks.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{taskStats.completed} completed</span>
                  <span>•</span>
                  <span>{taskStats.active} active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Keyboard shortcuts:</span>
                  <kbd className="kbd">⌘K</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
