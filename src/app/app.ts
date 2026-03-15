import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalModal } from './core/ui/global-modal/global-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cec-frontend');
}
