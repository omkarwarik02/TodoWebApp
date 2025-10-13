import { Component,inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { Title } from '@angular/platform-browser';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}
@Component({
  selector: 'app-todo-create',
  standalone:true,
  imports: [ButtonModule,AutoCompleteModule,MessageModule,ToastModule,ReactiveFormsModule,CommonModule],
  templateUrl: './todo-create.html',
  styleUrl: './todo-create.scss'
  
})
export class TodoCreate implements OnInit{
  private messageService = inject(MessageService);
  private todoStore =inject(TodoStore)
  createForm!: FormGroup
  private fb = inject(FormBuilder)
   todoId!: string;
    items: any[] = [];
    formSubmitted: boolean = false;

  ngOnInit() {
      this.createForm = this.fb.group({
        title: ['', Validators.required]
      })
  }
    search(event: AutoCompleteCompleteEvent) {
        this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }
    
    onSubmit() {
        this.formSubmitted = true;
        if (this.createForm.valid) {
          const title = this.createForm.value.title;
          this.todoStore.addTodo(title);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
        }
        this.createForm.reset();
            this.formSubmitted = false;
    }
     isInvalid(controlName: string) {
        const control = this.createForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }

}
