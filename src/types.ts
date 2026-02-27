export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayData {
  todos: Todo[];
}

export type TodoStore = Record<string, DayData>;
