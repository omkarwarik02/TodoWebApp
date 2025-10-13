import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { Layout } from './layout/layout/layout';
import { TodoCreate } from './components/todo-create/todo-create';
import { TodoList } from './components/todo-list/todo-list';
import { Dashboard } from './components/dashboard/dashboard';
import { TodoEdit } from './components/todo-edit/todo-edit';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
{path:'register',loadComponent:() => import ('./components/register.component/register.component').then((c)=>c.RegisterComponent)
    
},
  {
    path: '',
    component:Layout,
    children:[
      {
        path:'todo-create',
        component:TodoCreate
      },
        {
        path:'todo-list',
        component:TodoList
      },
        {
        path:'dashboard',
        component:Dashboard
      },
        {
        path:'todo-edit/:id',
        component:TodoEdit
      },
    ]
  }


];
