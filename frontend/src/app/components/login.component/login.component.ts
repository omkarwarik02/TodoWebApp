import { Component, inject ,NgModule,OnInit} from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-login.component',
  standalone:true,
  imports: [DividerModule,ButtonModule,InputTextModule,ReactiveFormsModule,CommonModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit  {
  private auth = inject(AuthService);
  private fb  = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authStore = inject(AuthStore)
  private router = inject(Router);
 loginForm! : FormGroup;
 formsubmitted = false; 

  ngOnInit() {
    this.loginForm =this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
      
    
  }
  login(){
    if(this.loginForm.invalid){
      this.formsubmitted = true;
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please fill all fields', life: 3000});
     
      return;
    }
    this.auth.login(this.loginForm.value).subscribe({
      next:(res:any)=>{
         if (res.token) {
        // ✅ Store the token immediately
        this.authStore.setToken(res.token);
      
      }
         this.router.navigate(['/dashboard']);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!', life: 3000 });
          
      },
      error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error.msg, life: 3000 });
    }
    });
  }
  GoToRegister(){
    this.router.navigate(['/register']);
  }


}
