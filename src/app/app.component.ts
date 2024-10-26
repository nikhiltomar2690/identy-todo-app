import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define the Todo interface for better type safety
interface Todo {
  text: string;
  status: 'Pending' | 'In Progress' | 'Done';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'identy-todo-app';
  selectedDate: string = '';
  newTodo: string = '';
  todos: Record<string, Todo[]> = JSON.parse(
    localStorage.getItem('todos') || '{}'
  );

  // Add a new todo to the selected date
  addTodo(): void {
    // Validate input
    if (!this.selectedDate || !this.newTodo.trim()) return;

    const dateKey: string = new Date(this.selectedDate).toDateString();
    this.todos[dateKey] = this.todos[dateKey] || []; // Initialize if not present
    this.todos[dateKey].push({ text: this.newTodo, status: 'Pending' });
    this.newTodo = ''; // Clear input field
    this.saveTodos(); // Save the updated todos
  }

  // Update the status of a todo
  updateTodoStatus(date: string, todo: Todo): void {
    this.saveTodos(); // Save immediately after status change
  }

  // Remove a todo from a specific date
  removeTodo(date: string, todo: Todo): void {
    const dateTodos: Todo[] = this.todos[date];
    const index: number = dateTodos.indexOf(todo); // Find index of todo
    if (index !== -1) {
      dateTodos.splice(index, 1); // Remove todo
      if (dateTodos.length === 0) {
        delete this.todos[date]; // Remove date if no todos left
      }
      this.saveTodos(); // Save the updated todos
    }
  }

  // Get sorted dates (nearest to farthest)
  sortedDates(): string[] {
    return Object.keys(this.todos).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }

  // Save todos to local storage
  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}
