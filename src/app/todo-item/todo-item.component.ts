import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../todos.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({ required: true }) todo!: Todo;

  @Output() remove = new EventEmitter<Todo>();
  @Output() todoToggleChange = new EventEmitter<Todo>();
  @Output() update = new EventEmitter<Todo>();

  @ViewChild('todoInputRef') inputRef?: ElementRef;

  title = '';

  isEditing = false;

  toggleTodo(): void {
    this.todoToggleChange.emit(this.todo);
  }

  removeTodo(): void {
    this.remove.emit(this.todo);
  }

  startEdit() {
    this.isEditing = true;
  }

  finishEdit() {
    this.isEditing = false;
  }

  handleBlur(e: Event) {
    this.updateTodo();
  }

  handleFocus(e: Event) {
    this.title = this.todo.title;
  }

  updateTodo() {
    if (!this.title) {
      this.removeTodo();
    } else {
      this.todo.title = this.title.trim();
      this.update.emit(this.todo);
    }

    this.finishEdit();
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }
}
