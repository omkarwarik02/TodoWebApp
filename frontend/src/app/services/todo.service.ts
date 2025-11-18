import { inject, Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { TodoStore,Todo } from '../store/todo.store';
import { Observable } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { environment } from '../../environments/environment';





@Injectable({ providedIn: 'root' })
export class TodoService{
private apiUrl = 'https://todo-backend.onrender.com/api/todos';


    private http = inject(HttpClient);
    private auth = inject(AuthStore);

    private getAuthHeaders(){
        const token = this.auth.token;
        return {headers: new HttpHeaders({ Authorization: `Bearer ${token}`})};

    }
    getTodos():Observable<Todo[]>{
        return this.http.get<Todo[]>(this.apiUrl,this.getAuthHeaders());
    }
    addTodo(todo:{title:string; remindAt:string}):Observable<Todo>{
        return this.http.post<Todo>(this.apiUrl,todo,this.getAuthHeaders());
    }
    toggleTodo(id:string,completed:boolean):Observable<Todo>{
        return this.http.put<Todo>(`${this.apiUrl}/${id}`,{completed},this.getAuthHeaders());
    }
    removeTodo(id:string):Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`,this.getAuthHeaders());
    }
    clearCompleted():Observable<any>{
        return this.http.delete(`${this.apiUrl}/clear-completed`,this.getAuthHeaders());
    }
    updateTodo(id: string, data: Partial<{ title: string; completed: boolean }>) {
  return this.http.put<Todo>(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
}

}