'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import DonutChart from '@/components/DonutChart'

interface Task {
  id: string
  title: string
  column: 'backlog' | 'inProgress' | 'done'
}

interface QuarterGoal {
  id: string
  title: string
  progress: number
}

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'border-gray-600' },
  { id: 'inProgress', title: 'In Progress', color: 'border-primary' },
  { id: 'done', title: 'Done', color: 'border-accent' }
]

export default function GoalKanbanPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = params.goalId as string

  const [goal, setGoal] = useState<QuarterGoal | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  // Load goal and tasks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && goalId) {
      // Find goal from all quarters
      const quarters = ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4']
      let foundGoal: QuarterGoal | null = null

      for (const quarter of quarters) {
        const stored = localStorage.getItem(`quarterGoals:${quarter}`)
        if (stored) {
          const goals: QuarterGoal[] = JSON.parse(stored)
          foundGoal = goals.find(g => g.id === goalId) || null
          if (foundGoal) break
        }
      }

      setGoal(foundGoal)

      // Load tasks
      const storedTasks = localStorage.getItem(`leadTasks:${goalId}`)
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    }
  }, [goalId])

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`leadTasks:${goalId}`, JSON.stringify(updatedTasks))
    }
  }

  // Calculate completion percentage
  const completionPercentage = tasks.length > 0
    ? Math.round((tasks.filter(task => task.column === 'done').length / tasks.length) * 100)
    : 0

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    const updatedTasks = tasks.map(task =>
      task.id === draggableId
        ? { ...task, column: destination.droppableId as Task['column'] }
        : task
    )

    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  // Add new task
  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      column: 'backlog'
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    setNewTaskTitle('')
    setIsAddingTask(false)
  }

  // Delete task
  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  // Get tasks by column
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId)
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">目標が見つかりません</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {goal.title}
            </h1>
          </div>

          {/* Goal Progress */}
          <div className="flex items-center gap-6 bg-gray-800/50 rounded-xl p-6">
            <div className="relative">
              <DonutChart completion={completionPercentage} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">進捗状況</h3>
              <p className="text-gray-400">
                {tasks.filter(t => t.column === 'done').length} / {tasks.length} タスク完了
              </p>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        <div className="mb-8">
          {isAddingTask ? (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="新しいタスクを入力..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                  maxLength={100}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  disabled={!newTaskTitle.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  追加
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false)
                    setNewTaskTitle('')
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800/70 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg p-4 transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 text-primary" />
              <span className="text-gray-300">新しいタスクを追加</span>
            </button>
          )}
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="bg-gray-800/30 rounded-xl p-4">
                <h3 className={`text-lg font-semibold mb-4 pb-2 border-b-2 ${column.color}`}>
                  {column.title}
                  <span className="ml-2 text-sm text-gray-400">
                    ({getTasksByColumn(column.id).length})
                  </span>
                </h3>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] space-y-3 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-gray-700/30 rounded-lg' : ''
                      }`}
                    >
                      {getTasksByColumn(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-200 ${
                                snapshot.isDragging
                                  ? 'shadow-2xl rotate-2 scale-105'
                                  : 'hover:border-gray-600'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-3">
                                <p className="text-white text-sm leading-relaxed flex-1">
                                  {task.title}
                                </p>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-gray-500 hover:text-red-400 transition-colors duration-200 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty state */}
                      {getTasksByColumn(column.id).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">タスクがありません</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              まだタスクがありません
            </h3>
            <p className="text-gray-500 mb-6">
              目標達成のためのタスクを追加して始めましょう
            </p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              最初のタスクを追加
            </button>
          </div>
        )}
      </div>
    </div>
  )
}