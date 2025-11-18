import { Component, signal,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  ngOnInit(){
      if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('firebase-messaging-sw.js')
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.log("Service Worker registration failed:", err));
}
  }

}
