import { createEffect, createEvent, createStore } from "effector";

// Standard interface and functions
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const updateTodo = (todos: Todo[], id: number, text: string): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    text: todo.id === id ? text : todo.text,
  }));

const toggleTodo = (todos: Todo[], id: number): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    done: todo.id === id ? !todo.done : todo.done,
  }));

const removeTodo = (todos: Todo[], id: number): Todo[] =>
  todos.filter((todo) => todo.id !== id);

const addTodoList = (todos: Todo[], text: string): Todo[] => [
  ...todos,
  {
    id: Math.max(0, Math.max(...todos.map(({ id }) => id))) + 1,
    text,
    done: false,
  },
];

//effector state implementation

type Store = {
  todos: Todo[];
  newTodo: string;
};

export const setNewTodo = createEvent<string>();
export const addTodo = createEvent();
export const update = createEvent<{ id: number; text: string }>();
export const toggle = createEvent<number>();
export const remove = createEvent<number>();
export const load = createEffect(async (url: string) => {
  const req = await fetch(url);
  return req.json();
});
export default createStore<Store>({
  todos: [],
  newTodo: "",
})
  .on(setNewTodo, (state, newTodo) => ({
    ...state,
    newTodo,
  }))
  .on(addTodo, (state) => ({
    ...state,
    newTodo: "",
    todos: addTodoList(state.todos, state.newTodo),
  }))
  .on(update, (state, { id, text }) => ({
    ...state,
    todos: updateTodo(state.todos, id, text),
  }))
  .on(toggle, (state, id) => ({
    ...state,
    todos: toggleTodo(state.todos, id),
  }))
  .on(remove, (state, id) => ({
    ...state,
    todos: removeTodo(state.todos, id),
  }))
  .on(load.doneData, (state, todos) => ({
    ...state,
    todos,
  }));
