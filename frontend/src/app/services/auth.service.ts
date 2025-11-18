import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../store/auth.store';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService{
  private apiUrl = environment.apiUrl + "/auth";




    constructor(private http:HttpClient, private authStore: AuthStore){}

    login(data:any): Observable<any>{
         return this.http.post(`${this.apiUrl}/login`,data).pipe(
            tap((res:any)=>{
                if(res.token){
                    this.authStore.setToken(res.token);
                }
            })
         );
    }
    register(data:any){
       
        return this.http.post(`${this.apiUrl}/register`, data).pipe(
            tap((res:any)=>{
                
                if(res.token){
                    this.authStore.setToken(res.token);
                }
            })
        );
    

        
    }
    logout(){
        this.authStore.clearToken();
    }
}