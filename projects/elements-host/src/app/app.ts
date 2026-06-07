import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <h1>Hello, {{ title() }}</h1>

    
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('elements-host');
}
