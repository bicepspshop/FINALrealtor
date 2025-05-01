"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, CalendarClock, Clock, Check, X, Phone, Mail, Calendar, CalendarIcon, Trash } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TextFolding } from "@/components/ui/text-folding"

type Note = {
  id?: string
  content: string
  created_at?: string
}

type Task = {
  id?: string
  task_type: string
  title: string
  description?: string
  due_date?: string
  is_completed: boolean
  created_at?: string
}

interface NotesTasksBlockProps {
  clientId: string
  notes?: Note[]
  tasks?: Task[]
  lastContactDate?: string | null
}

export function NotesTasksBlock({ 
  clientId, 
  notes = [], 
  tasks = [],
  lastContactDate
}: NotesTasksBlockProps) {
  const [activeTab, setActiveTab] = useState<string>("notes")
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false)
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false)
  const [newNote, setNewNote] = useState<string>("")
  const [newTask, setNewTask] = useState<{
    type: string;
    title: string;
    description?: string;
    dueDate?: Date;
  }>({
    type: "call",
    title: "",
    description: "",
  })
  const [loading, setLoading] = useState<boolean>(false)

  // Set the current date as default for new tasks
  const today = new Date()

  // Notes functions
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Введите текст заметки")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: newNote
        })
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить заметку")
      }

      toast.success("Заметка добавлена")
      setNewNote("")
      setIsAddingNote(false)
      
      // Refresh the page to show new note
      window.location.reload()
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Не удалось добавить заметку")
    } finally {
      setLoading(false)
    }
  }

  // Delete note function
  const deleteNote = async (noteId: string) => {
    if (!noteId) return;
    
    if (!confirm("Вы уверены, что хотите удалить эту заметку?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить заметку");
      }

      toast.success("Заметка удалена");
      
      // Refresh the page to show updated notes
      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Не удалось удалить заметку");
    } finally {
      setLoading(false);
    }
  };

  // Tasks functions
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Введите название задачи")
      return
    }

    if (!newTask.type) {
      toast.error("Выберите тип задачи")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          task_type: newTask.type,
          title: newTask.title,
          description: newTask.description || "",
          due_date: newTask.dueDate ? newTask.dueDate.toISOString() : null,
          is_completed: false
        })
      })

      if (!response.ok) {
        throw new Error("Не удалось добавить задачу")
      }

      toast.success("Задача добавлена")
      setNewTask({
        type: "call",
        title: "",
        description: "",
      })
      setIsAddingTask(false)
      
      // Refresh the page to show new task
      window.location.reload()
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Не удалось добавить задачу")
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, isCompleted: boolean) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clients/${clientId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          is_completed: isCompleted
        })
      })

      if (!response.ok) {
        throw new Error("Не удалось обновить статус задачи")
      }

      toast.success(isCompleted ? "Задача отмечена как выполненная" : "Задача отмечена как активная")
      
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Не удалось обновить статус задачи")
    } finally {
      setLoading(false)
    }
  }

  // Delete task function
  const deleteTask = async (taskId: string) => {
    if (!taskId) return;
    
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить задачу");
      }

      toast.success("Задача удалена");
      
      // Refresh the page to show updated tasks
      window.location.reload();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Не удалось удалить задачу");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Н/Д"
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru })
  }

  // Format relative date (for due dates)
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "Н/Д"
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const dueDate = new Date(date)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `Просрочено (${Math.abs(diffDays)} дн.)`
    } else if (diffDays === 0) {
      return "Сегодня"
    } else if (diffDays === 1) {
      return "Завтра"
    } else {
      return `Через ${diffDays} дн.`
    }
  }

  // Get task icon based on type
  const getTaskIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case "email":
        return <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return <CalendarClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  // Get task type name in Russian
  const getTaskTypeName = (type: string) => {
    switch (type) {
      case "call":
        return "Звонок"
      case "email":
        return "Email"
      case "meeting":
        return "Встреча"
      default:
        return "Задача"
    }
  }

  // Sort tasks by due date and completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    
    // Then by due_date if both have it
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    
    // Tasks with due_date come before those without
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    
    // Finally sort by created_at as fallback
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    
    return 0;
  });

  // Sort notes by created_at (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  return (
    <Card className="shadow-elegant dark:shadow-elegant-dark overflow-hidden rounded-sm border-0 animate-fade-in-up theme-transition">
      <CardHeader className="border-b border-gray-100 dark:border-dark-slate bg-gray-50/50 dark:bg-dark-slate/50 py-5 theme-transition">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg text-luxury-black dark:text-white theme-transition">
            <MessageSquare className="h-5 w-5 text-luxury-gold dark:text-luxury-royalBlue/90 theme-transition" />
            Заметки и задачи
          </CardTitle>
          {lastContactDate && (
            <div className="flex items-center text-xs text-luxury-black/60 dark:text-white/60 theme-transition">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Последний контакт: {formatDate(lastContactDate)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-gray-50/70 dark:bg-dark-slate/30 rounded-none theme-transition border-b border-gray-100 dark:border-dark-slate">
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-white data-[state=active]:dark:bg-dark-graphite data-[state=active]:text-luxury-gold data-[state=active]:dark:text-luxury-royalBlue rounded-none"
            >
              Заметки ({notes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-white data-[state=active]:dark:bg-dark-graphite data-[state=active]:text-luxury-gold data-[state=active]:dark:text-luxury-royalBlue rounded-none"
            >
              Задачи ({tasks.filter(t => !t.is_completed).length})
            </TabsTrigger>
          </TabsList>
          
          {/* Notes Tab */}
          <TabsContent value="notes" className="p-0">
            <div className="p-5">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingNote(true)}
                  className="text-xs border-gray-200 dark:border-dark-slate text-luxury-black/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-slate/50 theme-transition"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Добавить заметку
                </Button>
              </div>
              
              {sortedNotes.length === 0 ? (
                <div className="text-center py-8 text-luxury-black/60 dark:text-white/60 theme-transition">
                  У этого клиента пока нет заметок
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedNotes.map((note, index) => (
                    <div 
                      key={note.id || index} 
                      className="bg-gray-50 dark:bg-dark-slate/40 rounded-sm p-4 theme-transition relative"
                    >
                      <div className="text-xs text-luxury-black/60 dark:text-white/60 flex items-center gap-1 mb-2 theme-transition">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.created_at)}
                      </div>
                      <TextFolding
                        text={note.content}
                        title="Заметка"
                        className="text-sm text-luxury-black/80 dark:text-white/80 theme-transition"
                      />
                      {note.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNote(note.id!)}
                          className="absolute top-3 right-3 h-7 w-7 text-luxury-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent"
                          disabled={loading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="p-0">
            <div className="p-5">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingTask(true)}
                  className="text-xs border-gray-200 dark:border-dark-slate text-luxury-black/70 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-dark-slate/50 theme-transition"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                  Добавить задачу
                </Button>
              </div>
              
              {sortedTasks.length === 0 ? (
                <div className="text-center py-8 text-luxury-black/60 dark:text-white/60 theme-transition">
                  У этого клиента пока нет задач
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedTasks.map((task) => {
                    const isDueDatePassed = task.due_date && new Date(task.due_date) < new Date() && !task.is_completed
                    
                    return (
                      <div 
                        key={task.id} 
                        className={`border-l-2 ${task.is_completed 
                          ? 'border-gray-300 dark:border-gray-600' 
                          : isDueDatePassed 
                            ? 'border-red-400 dark:border-red-600' 
                            : 'border-green-400 dark:border-green-600'
                        } p-4 rounded-sm bg-gray-50 dark:bg-dark-slate/40 theme-transition relative`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className={`flex-shrink-0 w-8 h-8 rounded-full ${task.is_completed 
                                ? 'bg-gray-100 dark:bg-dark-slate/80' 
                                : isDueDatePassed 
                                  ? 'bg-red-50 dark:bg-red-900/30' 
                                  : 'bg-blue-50 dark:bg-blue-900/30'
                              } flex items-center justify-center theme-transition`}
                            >
                              {getTaskIcon(task.task_type)}
                            </div>
                            <div>
                              <h4 className={`text-sm font-medium ${task.is_completed 
                                ? 'text-luxury-black/50 dark:text-white/50 line-through' 
                                : 'text-luxury-black/90 dark:text-white/90'
                              } theme-transition`}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="px-2 py-0 text-xs rounded">
                                  {getTaskTypeName(task.task_type)}
                                </Badge>
                                
                                {task.due_date && (
                                  <span className={`text-xs ${task.is_completed 
                                    ? 'text-gray-400 dark:text-gray-500' 
                                    : isDueDatePassed 
                                      ? 'text-red-500 dark:text-red-400' 
                                      : 'text-green-600 dark:text-green-400'
                                  } flex items-center gap-1 theme-transition`}>
                                    <Clock className="h-3 w-3" />
                                    {formatDueDate(task.due_date)}
                                  </span>
                                )}
                              </div>
                              
                              {task.description && (
                                <TextFolding
                                  text={task.description}
                                  title={`Задача: ${task.title}`}
                                  className={`text-xs ${task.is_completed 
                                    ? 'text-luxury-black/40 dark:text-white/40' 
                                    : 'text-luxury-black/70 dark:text-white/70'
                                  } theme-transition`}
                                />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-6 w-6 rounded-full mr-2 ${task.is_completed 
                                ? 'border-gray-200 dark:border-dark-slate hover:bg-gray-100 dark:hover:bg-dark-slate/60' 
                                : 'border-green-200 dark:border-green-800/30 hover:bg-green-50 dark:hover:bg-green-900/20'
                              } theme-transition`}
                              onClick={() => updateTaskStatus(task.id!, !task.is_completed)}
                              disabled={loading}
                            >
                              {task.is_completed 
                                ? <X className="h-3 w-3 text-gray-400 dark:text-gray-500" /> 
                                : <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                              }
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id!)}
                              className="h-6 w-6 text-luxury-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-transparent p-0"
                              disabled={loading}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-luxury-black dark:text-white theme-transition">
              Добавить заметку
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Текст заметки..."
              className="resize-none min-h-[150px]"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddingNote(false)} 
              disabled={loading}
              className="border-gray-300 dark:border-gray-600 text-luxury-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-slate/80 theme-transition"
            >
              Отмена
            </Button>
            <Button type="button" onClick={handleAddNote} disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg text-luxury-black dark:text-white theme-transition">
              Добавить задачу
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-luxury-black/70 dark:text-white/70 mb-2 block theme-transition">
                Тип задачи
              </label>
              <Select
                value={newTask.type}
                onValueChange={(value) => setNewTask({...newTask, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип задачи" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Звонок</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Встреча</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-luxury-black/70 dark:text-white/70 mb-2 block theme-transition">
                Название задачи
              </label>
              <Input
                placeholder="Введите название"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm text-luxury-black/70 dark:text-white/70 mb-2 block theme-transition">
                Описание (опционально)
              </label>
              <Textarea
                placeholder="Введите описание..."
                className="resize-none"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm text-luxury-black/70 dark:text-white/70 mb-2 block theme-transition">
                Срок выполнения (опционально)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600 text-luxury-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-slate/80 theme-transition">
                    {newTask.dueDate ? (
                      format(newTask.dueDate, "PPP", { locale: ru })
                    ) : (
                      <span className="text-luxury-black/50 dark:text-white/50 theme-transition">Выберите дату</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newTask.dueDate}
                    onSelect={(date) => setNewTask({...newTask, dueDate: date || undefined})}
                    initialFocus
                    disabled={(date) => date < new Date(today.setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddingTask(false)} 
              disabled={loading}
              className="border-gray-300 dark:border-gray-600 text-luxury-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-slate/80 theme-transition"
            >
              Отмена
            </Button>
            <Button type="button" onClick={handleAddTask} disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 