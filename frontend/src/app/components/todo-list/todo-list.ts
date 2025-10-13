import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Todo, TodoStore } from '../../store/todo.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone:true,
  imports: [CardModule,CommonModule,FormsModule,ToggleButtonModule,ButtonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {
  protected todoStore = inject(TodoStore)
  private router = inject(Router);
  disabledId: string | null = null;

ngOnInit() {
    this.todoStore.loadTodos();
}
onToggle(id:string, completed: boolean){
  this.disabledId = id;
  this.todoStore.toggleTodo(id.trim(),completed);

  setTimeout(()=>{
    this.disabledId = null;
  },1000)
}

onDelete(id:string){
  this.todoStore.removeTodo(id);
}
onEdit(todo:Todo){
  this.router.navigate(['/todo-edit',todo._id]);
}
}
