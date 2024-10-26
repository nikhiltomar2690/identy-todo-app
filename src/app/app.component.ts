import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define the Todo interface for better type safety
// the main advantage of Typescript is that it is a statically typed language
interface Todo {
  text: string;
  status: 'Pending' | 'In Progress' | 'Done';
}

@Component({
  selector: 'app-root',
  standalone: true,
  // to use the ngModel directive, we need to import the FormsModule
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'identy-todo-app';
  selectedDate: string = '';
  newTodo: string = '';

  // the Record is used to mention the todos as a key-value pair of string and Todo[]
  todos: Record<string, Todo[]> = JSON.parse(
    localStorage.getItem('todos') || '{}'
  );

  addTodo(): void {
    if (!this.selectedDate || !this.newTodo.trim()) return;

    const dateKey: string = new Date(this.selectedDate).toDateString();
    this.todos[dateKey] = this.todos[dateKey] || [];
    this.todos[dateKey].push({ text: this.newTodo, status: 'Pending' });
    this.newTodo = ''; // Clear input field after new todo added
    this.saveTodos();
  }

  updateTodoStatus(date: string, todo: Todo): void {
    this.saveTodos();
  }

  // Remove a todo from a specific date
  removeTodo(date: string, todo: Todo): void {
    const dateTodos: Todo[] = this.todos[date];
    const index: number = dateTodos.indexOf(todo);
    if (index !== -1) {
      dateTodos.splice(index, 1);
      if (dateTodos.length === 0) {
        delete this.todos[date];
      }
      this.saveTodos();
    }
  }

  sortedDates(): string[] {
    return Object.keys(this.todos).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
