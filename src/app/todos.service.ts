import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { take } from 'rxjs';

export interface Todo {
  title: string;
  completed: boolean;
}

export interface TodoDto {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  private readonly http = inject(HttpClient);

  todos: Todo[] = this.restoreTodosFromStorage();

  addItem(title: string): void {
    const todo: Todo = {
      title,
      completed: false,
    };

    this.todos.push(todo);
    this.syncTodosToStorage();
  }

  syncWithCloud(pageSize = 6) {
    this.http
      .get<Array<TodoDto>>(`https://dummyjson.com/todos/random/${pageSize}`)
      .pipe(take(1))
      .subscribe((todos: Array<TodoDto>) => {
        this.todos.length = 0;

        todos.forEach(({ todo: title, completed }) => {
          this.todos.push({ title, completed });
        });

        this.syncTodosToStorage();
      });
  }

  removeItem(targetTodo: Todo): void {
    this.todos = this.todos.filter((todo) => todo !== targetTodo);

    this.syncTodosToStorage();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.syncTodosToStorage();
  }

  toggleAll(completed: boolean): void {
    this.todos = this.todos.map((todo) => ({ ...todo, completed }));
    this.syncTodosToStorage();
  }

  toggle(todo: Todo) {
    this.todos = this.todos.map((td) => {
      const isSameTodo = td === todo;

      if (!isSameTodo) return td;

      return {
        ...td,
        completed: !td.completed,
      };
    });
    this.syncTodosToStorage();
  }

  update(todo: Todo) {
    this.todos = this.todos.map((td) => {
      const isSameTodo = td === todo;

      if (!isSameTodo) return td;

      return todo;
    });
    this.syncTodosToStorage();
  }

  getItems(type = 'all'): Todo[] {
    switch (type) {
      case 'active':
        return this.todos.filter((todo) => !todo.completed);
      case 'completed':
        return this.todos.filter((todo) => todo.completed);
    }

    return this.todos;
  }

  private syncTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private restoreTodosFromStorage() {
    const storedTodos = JSON.parse(localStorage.getItem('todos') ?? '[]');

    return storedTodos;
  }
}
