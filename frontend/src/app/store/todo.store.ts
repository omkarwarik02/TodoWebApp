import { inject, Injectable, signal } from '@angular/core';
import { TodoService } from '../services/todo.service';

export interface Todo {
    _id:string;
    title:string;
    completed:boolean;
    remindAt?:string;
}

export interface AppState{
    todos: Todo[];
}
@Injectable({providedIn: 'root'})

export class TodoStore {
     private todoService = inject(TodoService);
    private state = signal<AppState>({todos: []});
   

    

    //Getter functions
    get todos(): Todo[]{
        return this.state().todos;
    }
    get completedTodos(): Todo[]{
        return this.state().todos.filter(todo=>todo.completed);
    }
    get pendingTodos():Todo[] {
        return this.state().todos.filter(todo=>!todo.completed);
    }
    //Load todos from backend
    loadTodos(){
        this.todoService.getTodos().subscribe(todos=>{
            const formatted = todos.map(t=>({...t,_id:t._id || t._id.toString()}))
            this.state.set({todos:formatted})})
    }
    // Private method to modify state
    addTodo(todo:{title:string; remindAt:string}){
    this.todoService.addTodo(todo).subscribe(newTodo=>{
        this.state.update(prev=>({
            todos:[...prev.todos,newTodo]
        }));
    });
        
    }

   toggleTodo(id: string, completed?: boolean) {
  const todo = this.state().todos.find(t => t._id === id);
  if (!todo) return;

  const newStatus = completed !== undefined ? completed : !todo.completed;

  this.todoService.toggleTodo(id, newStatus).subscribe(updatedTodo => {
    this.state.update(prev => ({
      todos: prev.todos.map(t => (t._id === id ? updatedTodo : t))
    }));
  });
}


    removeTodo(id:string){
        this.todoService.removeTodo(id).subscribe(() => {
    this.state.update(prev => ({
      todos: prev.todos.filter(t => t._id !== id)
    })
        )}
    )}
    clearCompleted(){
        this.state.update(prev=>({
            todos:prev.todos.filter(todo=> !todo.completed)
        }));
        
    }
   updateTodo(id: string, updatedFields: Partial<{ title: string; completed: boolean }>) {
  const todo = this.state().todos.find(t => t._id === id?.trim());
  if (!todo) return;

  this.todoService.updateTodo(id.trim(), updatedFields).subscribe({
    next: (updatedTodo) => {
      const formatted = { ...updatedTodo, _id: updatedTodo._id || id };
      this.state.update(prev => ({
        todos: prev.todos.map(t => (t._id === formatted._id ? formatted : t))
      }));
    },
    error: err => console.error('Update failed:', err)
  });
}


}
