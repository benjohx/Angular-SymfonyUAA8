import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
<div class="app-container">
  <!-- Main content -->
  <main class="main-content">
    <router-outlet></router-outlet>
  </main>

  <!-- Footer -->
  <app-footer></app-footer>
</div>
  `
})
export class AppComponent { title = 'frontend';}
