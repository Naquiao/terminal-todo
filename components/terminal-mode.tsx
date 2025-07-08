"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"

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

interface TerminalModeProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onModeSwitch: () => void
}

interface CommandOutput {
  type: 'output' | 'error' | 'success' | 'command'
  content: string
  timestamp: string
}

interface Command {
  name: string
  args: string[]
  flags: Record<string, string>
}

export default function TerminalMode({ tasks, onTasksChange, onModeSwitch }: TerminalModeProps) {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      type: 'output',
      content: 'Terminal Todo Manager v3.0.0 - Type "help" for available commands',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isWaitingForInput, setIsWaitingForInput] = useState(false)
  const [pendingAction, setPendingAction] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [history])

  const parseCommand = (input: string): Command => {
    const parts = input.trim().split(' ')
    const name = parts[0]
    const args: string[] = []
    const flags: Record<string, string> = {}
    
    let i = 1
    while (i < parts.length) {
      if (parts[i].startsWith('--')) {
        const flagName = parts[i].substring(2)
        if (i + 1 < parts.length && !parts[i + 1].startsWith('--')) {
          flags[flagName] = parts[i + 1]
          i += 2
        } else {
          flags[flagName] = 'true'
          i++
        }
      } else if (parts[i].startsWith('"')) {
        // Handle quoted strings
        let quotedString = parts[i].substring(1)
        i++
        while (i < parts.length && !parts[i - 1].endsWith('"')) {
          quotedString += ' ' + parts[i]
          i++
        }
        if (quotedString.endsWith('"')) {
          quotedString = quotedString.substring(0, quotedString.length - 1)
        }
        args.push(quotedString)
      } else {
        args.push(parts[i])
        i++
      }
    }
    
    return { name, args, flags }
  }

  const addOutput = (content: string, type: 'output' | 'error' | 'success' | 'command' = 'output') => {
    const newOutput: CommandOutput = {
      type,
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
    setHistory(prev => [...prev, newOutput])
  }

  const executeCreate = (args: string[], flags: Record<string, string>) => {
    if (args.length === 0) {
      addOutput('Error: Task description is required', 'error')
      addOutput('Usage: create "My task here" --project "My project" --priority High', 'output')
      return
    }

    const taskText = args.join(' ')
    const project = flags.project || "None"
    const priority = (flags.priority?.toLowerCase() as "low" | "medium" | "high") || "medium"
    
    // Map project to category for consistency with GUI
    const categoryMap: Record<string, string> = {
      "None": "other",
      "Personal": "personal", 
      "Work": "work",
      "Shopping": "shopping",
      "Health": "health"
    }
    
    const category = categoryMap[project] || "other"

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      category,
      priority,
    }

    onTasksChange([newTask, ...tasks])
    addOutput(`✓ Task created: "${taskText}" [Project: ${project}, Priority: ${priority.toUpperCase()}]`, 'success')
  }

  const executeComplete = () => {
    const activeTasks = tasks.filter(task => !task.completed)
    if (activeTasks.length === 0) {
      addOutput('No active tasks to complete', 'output')
      return
    }

    addOutput('Active tasks:', 'output')
    activeTasks.forEach((task, index) => {
      addOutput(`  [${index + 1}] ${task.text} (${task.priority.toUpperCase()}, ${task.category})`, 'output')
    })
    addOutput('', 'output')
    addOutput('Select task to complete [1-' + activeTasks.length + ']:' + ' ', 'output')
    
    setIsWaitingForInput(true)
    setPendingAction({ type: 'complete', tasks: activeTasks })
  }

  const executeDrop = () => {
    if (tasks.length === 0) {
      addOutput('No tasks to delete', 'output')
      return
    }

    addOutput('All tasks:', 'output')
    tasks.forEach((task, index) => {
      const status = task.completed ? '[DONE]' : '[ACTIVE]'
      addOutput(`  [${index + 1}] ${task.text} ${status} (${task.priority.toUpperCase()}, ${task.category})`, 'output')
    })
    addOutput('', 'output')
    addOutput('Select task to delete [1-' + tasks.length + ']:' + ' ', 'output')
    
    setIsWaitingForInput(true)
    setPendingAction({ type: 'drop', tasks: tasks })
  }

  const executeHelp = () => {
    const helpLines = [
      '',
      '┌─ Terminal Todo Manager - Available Commands ─┐',
      '',
      '📋 Task Management:',
      '  create "Task description" [options]',
      '    Creates a new task with optional metadata',
      '    --project   Project name (default: "None")',
      '    --priority  Priority level: Low, Medium, High (default: Medium)',
      '    Example: create "Buy groceries" --project "Personal" --priority High',
      '',
      '  complete',
      '    Mark a task as completed via interactive selection',
      '',
      '  drop',
      '    Delete a task with confirmation prompt',
      '',
      '⚙️  System:',
      '  help',
      '    Display this help message',
      '',
      '  mode gui',
      '    Switch to graphical interface',
      '',
      '└────────────────────────────────────────────────┘',
      ''
    ]

    helpLines.forEach(line => {
      addOutput(line, 'output')
    })
  }

  const handleCommand = (input: string) => {
    if (isWaitingForInput && pendingAction) {
      handlePendingInput(input)
      return
    }

    if (input.trim() === '') return

    // Add to command history
    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)

    // Display the command
    addOutput(`$ ${input}`, 'command')

    const cmd = parseCommand(input)

    switch (cmd.name) {
      case 'create':
        executeCreate(cmd.args, cmd.flags)
        break
      case 'complete':
        executeComplete()
        break
      case 'drop':
        executeDrop()
        break
      case 'help':
        executeHelp()
        break
      case 'mode':
        if (cmd.args[0] === 'gui') {
          addOutput('Switching to GUI mode...', 'success')
          setTimeout(onModeSwitch, 500)
        } else {
          addOutput('Usage: mode gui', 'error')
        }
        break
      case 'clear':
        setHistory([
          {
            type: 'output',
            content: 'Terminal Todo Manager v3.0.0 - Type "help" for available commands',
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
          }
        ])
        break
      default:
        addOutput(`Unknown command: ${cmd.name}. Type "help" for available commands.`, 'error')
    }
  }

  const handlePendingInput = (input: string) => {
    const index = parseInt(input.trim()) - 1
    
    if (pendingAction.type === 'complete') {
      if (isNaN(index) || index < 0 || index >= pendingAction.tasks.length) {
        addOutput('Invalid selection. Please try again.', 'error')
        return
      }
      
      const taskToComplete = pendingAction.tasks[index]
      const updatedTasks = tasks.map(task => 
        task.id === taskToComplete.id ? { ...task, completed: true } : task
      )
      onTasksChange(updatedTasks)
      addOutput(`✓ Completed: "${taskToComplete.text}"`, 'success')
      
    } else if (pendingAction.type === 'drop') {
      if (isNaN(index) || index < 0 || index >= pendingAction.tasks.length) {
        addOutput('Invalid selection. Please try again.', 'error')
        return
      }
      
      const taskToDelete = pendingAction.tasks[index]
      addOutput(`Are you sure you want to delete "${taskToDelete.text}"? (y/N):` + ' ', 'output')
      setPendingAction({ type: 'confirm_drop', task: taskToDelete })
      return
      
    } else if (pendingAction.type === 'confirm_drop') {
      if (input.trim().toLowerCase() === 'y' || input.trim().toLowerCase() === 'yes') {
        const updatedTasks = tasks.filter(task => task.id !== pendingAction.task.id)
        onTasksChange(updatedTasks)
        addOutput(`✓ Deleted: "${pendingAction.task.text}"`, 'success')
      } else {
        addOutput('Delete cancelled.', 'output')
      }
    }
    
    setIsWaitingForInput(false)
    setPendingAction(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand(command)
      setCommand("")
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        if (newIndex === commandHistory.length - 1) {
          setHistoryIndex(-1)
          setCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCommand(commandHistory[newIndex])
        }
      }
    }
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
                <span className="text-sm">~/dev/terminal-todo-manager [TERMINAL MODE]</span>
              </div>
            </div>
            <Button 
              onClick={onModeSwitch}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              Back to GUI
            </Button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="backdrop-blur-xl bg-white/10 border-x border-white/20 rounded-b-2xl p-6 shadow-2xl">
          {/* Terminal Output */}
          <div 
            ref={scrollRef}
            className="h-[70vh] overflow-y-auto p-4 bg-black/50 border border-white/20 rounded-lg font-mono"
          >
            {/* Terminal History */}
            {history.map((output, index) => (
              <div key={index} className="mb-1">
                <span 
                  className={`text-sm ${
                    output.type === 'error' ? 'text-red-400' : 
                    output.type === 'success' ? 'text-green-400' : 
                    output.type === 'command' ? 'text-cyan-400' :
                    'text-white'
                  }`}
                >
                  {output.content}
                </span>
              </div>
            ))}

            {/* Current Command Line */}
            <div className="flex items-center mt-2">
              <span className="text-purple-400 text-sm mr-2">
                user@terminal:~/todo$
              </span>
              <input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isWaitingForInput ? "Enter selection..." : ""}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 font-mono text-sm"
                autoFocus
              />
              <span className="text-white animate-pulse">|</span>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 text-white/40 text-xs flex justify-between">
            <span>
              Total: {tasks.length} | Active: {tasks.filter(t => !t.completed).length} | 
              Completed: {tasks.filter(t => t.completed).length}
            </span>
            <span>
              Type "help" for commands | "clear" to clear screen
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 