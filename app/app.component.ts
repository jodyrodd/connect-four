import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <game-board></game-board>
    `
})
export class AppComponent {
    title = 'Connect 4';
}
