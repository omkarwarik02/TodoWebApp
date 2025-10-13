import { Component,inject,OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [MenubarModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {

    items: MenuItem[] | undefined;
    private router = inject(Router);

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                root:true,
                 command: ()=>{
                  this.router.navigate(['/dashboard'])
                }
            },
            {
                label: 'Create',
                icon: 'pi pi-create',
                root:true,
                command:()=>{
                  this.router.navigate(['/todo-create']);
                }
            },
            {
                label: 'Todos',
                icon: 'pi pi-create',
                root:true,
               command:()=>{
                this.router.navigate(['/todo-list']);
               }
              },
              {
                label: 'LogOut',
                icon: 'pi pi-create',
                root:true,
                styleClass:'logout-item',
               command:()=>{
                this.router.navigate(['/login']);
               }
              }
          ]
        }



}
