import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  setMonth,
  setYear
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Plus, Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ListTodo, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Todo, TodoStore } from './types';

const STORAGE_KEY = 'todo_dashboard_2026_data';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start at Jan 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 1));
  const [todoStore, setTodoStore] = useState<TodoStore>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoStore));
  }, [todoStore]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentTodos = todoStore[selectedDateKey]?.todos || [];

  const addTodo = () => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: '',
      completed: false,
    };
    setTodoStore(prev => ({
      ...prev,
      [selectedDateKey]: {
        todos: [...(prev[selectedDateKey]?.todos || []), newTodo]
      }
    }));
  };

  const updateTodoText = (id: string, text: string) => {
    setTodoStore(prev => ({
      ...prev,
      [selectedDateKey]: {
        todos: prev[selectedDateKey].todos.map(t => t.id === id ? { ...t, text } : t)
      }
    }));
  };

  const toggleTodo = (id: string) => {
    setTodoStore(prev => ({
      ...prev,
      [selectedDateKey]: {
        todos: prev[selectedDateKey].todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      }
    }));
  };

  const getDayScore = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return todoStore[key]?.todos.filter(t => t.completed).length || 0;
  };

  const months = Array.from({ length: 12 }, (_, i) => setMonth(new Date(2026, 0, 1), i));

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans flex flex-col md:flex-row">
      {/* Left Panel: Calendar */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-bottom border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              2026 待办台
            </h1>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 font-medium min-w-[100px] text-center">
                {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
              </span>
              <button 
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Month Quick Switcher */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {months.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDate(m)}
                className={`py-2 text-sm rounded-md transition-all ${
                  isSameMonth(m, currentDate) 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {format(m, 'MMM', { locale: zhCN })}
              </button>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const score = getDayScore(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all group ${
                    isSelected 
                      ? 'bg-indigo-50 ring-2 ring-indigo-600 ring-inset' 
                      : 'hover:bg-gray-50'
                  } ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </span>
                  {score > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                    >
                      {score}
                    </motion.div>
                  )}
                  {isSameDay(day, new Date()) && !isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>本月总分:</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              {calendarDays
                .filter(d => isSameMonth(d, currentDate))
                .reduce((acc, d) => acc + getDayScore(d), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel: Todo Management */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ListTodo className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">今日待办</h2>
            </div>
            <p className="text-gray-500 text-lg">
              {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
            </p>
          </header>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {currentTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-gray-200 hover:border-indigo-400 text-transparent'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) => updateTodoText(todo.id, e.target.value)}
                    placeholder="输入待办事项..."
                    className={`flex-1 bg-transparent border-none focus:ring-0 text-lg transition-all ${
                      todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={addTodo}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-lg">添加待办事项</span>
            </button>

            {currentTodos.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">今天还没有待办事项，点击下方按钮添加一个吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
