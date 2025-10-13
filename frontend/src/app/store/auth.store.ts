import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class AuthStore {
    private state = signal<{token: string | null}>({ token: null});

    constructor(){
        const savedtoken = localStorage.getItem('token');
        if(savedtoken){
            this.state.set({token:savedtoken});
        }
    }
    //Getter to access token
    get token(): string | null{
        return this.state().token;
    }

    //Getter to check authentication
    get isAuthenticated(): boolean{
        return !!this.state().token;
    }

    //Set token after login
    setToken(token:string){
        this.state.set({token});
        localStorage.setItem('token',token);
    }
    //clear token on logout
    clearToken(){
        this.state.set({token:null});
        localStorage.removeItem('token');
    }
}