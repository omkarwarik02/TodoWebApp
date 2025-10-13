import { Component, inject, Input, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TodoStore } from '../../store/todo.store';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from "primeng/toast";
import { Router } from '@angular/router';
import { Todo } from '../../store/todo.store';
import { ActivatedRoute } from '@angular/router';
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
  selector: 'app-todo-edit',
  imports: [ButtonModule,AutoCompleteModule,MessageModule,ToastModule,ReactiveFormsModule,CommonModule],
  templateUrl: './todo-edit.html',
  styleUrl: './todo-edit.scss'
})
export class TodoEdit implements OnInit{
   todo!: Todo;
  private route = inject(ActivatedRoute);
  private todoStore = inject(TodoStore);
  private router = inject(Router);
  private messageService = inject(MessageService);
   editForm!: FormGroup
  private fb = inject(FormBuilder)
    formSubmitted: boolean = false;
   items: any[] = [];

    value: any;
    ngOnInit() {
      const todoId = this.route.snapshot.paramMap.get('id')!;
    this.todo = this.todoStore.todos.find(t => t._id === todoId)!;
      this.editForm = this.fb.group({
     title: [this.todo?.title , Validators.required]

      })
  }

   onSubmit(id:string){
     if (this.editForm.valid) {
      const newTitle = this.editForm.value.title;
      this.todoStore.updateTodo(this.todo._id, { title: newTitle });
       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      
    }
      this.editForm.reset();
        this.formSubmitted = false;
      return;

}
 

 }
